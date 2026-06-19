#!/usr/bin/env python3
"""
Fetches each team's professional club per player from the Wikipedia article
"2026 FIFA World Cup squads" and merges it into data/squads.json.

FIFA's API (used by scripts/fifa-fetch.mjs) only knows the national-team
squad, not each player's club — this is a separate, manual source. Re-run
this if Wikipedia's squad list changes (e.g. injury replacements) or if you
want to retry matching for players currently listed in the "unmatched" log.

Usage:
    python3 scripts/fetch-squad-clubs.py
"""
import json
import os
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQUADS_PATH = os.path.join(ROOT, "data/squads.json")
WIKI_API = "https://en.wikipedia.org/w/api.php"
WIKI_PAGE = "2026_FIFA_World_Cup_squads"
HEADERS = {"User-Agent": "DataGoal2026-SquadClubFetch/1.0 (research script for datagoal2026.xyz)"}

# Wikipedia section title -> our team slug (must match data/teams.ts slugs)
SECTION_TO_SLUG = {
    "Czech Republic": "chequia", "Mexico": "mexico", "South Africa": "sudafrica", "South Korea": "corea-del-sur",
    "Bosnia and Herzegovina": "bosnia-herzegovina", "Canada": "canada", "Qatar": "catar", "Switzerland": "suiza",
    "Brazil": "brasil", "Haiti": "haiti", "Morocco": "marruecos", "Scotland": "escocia",
    "Australia": "australia", "Paraguay": "paraguay", "Turkey": "turquia", "United States": "estados-unidos",
    "Curaçao": "curazao", "Ecuador": "ecuador", "Germany": "alemania", "Ivory Coast": "costa-de-marfil",
    "Japan": "japon", "Netherlands": "paises-bajos", "Sweden": "suecia", "Tunisia": "tunez",
    "Belgium": "belgica", "Egypt": "egipto", "Iran": "iran", "New Zealand": "nueva-zelanda",
    "Cape Verde": "cabo-verde", "Saudi Arabia": "arabia-saudita", "Spain": "espana", "Uruguay": "uruguay",
    "France": "francia", "Iraq": "irak", "Norway": "noruega", "Senegal": "senegal",
    "Algeria": "argelia", "Argentina": "argentina", "Austria": "austria", "Jordan": "jordania",
    "Colombia": "colombia", "DR Congo": "rd-congo", "Portugal": "portugal", "Uzbekistan": "uzbekistan",
    "Croatia": "croacia", "England": "inglaterra", "Ghana": "ghana", "Panama": "panama",
}


def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def fetch_sections():
    url = WIKI_API + "?" + urllib.parse.urlencode(
        {"action": "parse", "page": WIKI_PAGE, "prop": "sections", "format": "json"}
    )
    return fetch_json(url)["parse"]["sections"]


def fetch_wikitext(section_index):
    url = WIKI_API + "?" + urllib.parse.urlencode(
        {"action": "parse", "page": WIKI_PAGE, "section": section_index, "prop": "wikitext", "format": "json"}
    )
    for attempt in range(5):
        try:
            data = fetch_json(url)
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 4:
                time.sleep(5 * (attempt + 1))
                continue
            raise
    return data["parse"]["wikitext"]["*"]


LINK_RE = re.compile(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]")


def strip_links(s):
    return LINK_RE.sub(r"\1", s).strip()


def extract_player_records(wikitext):
    """Each player entry is one line; it can contain nested templates
    (e.g. age={{birth date and age2|...}}), so this needs brace-depth-aware
    parsing to find the outer template's real closing `}}`."""
    records = []
    for line in wikitext.split("\n"):
        line = line.strip()
        if not line.startswith("{{nat fs g player|"):
            continue
        depth, end, i, n = 0, None, 0, len(line)
        while i < n:
            if line[i : i + 2] == "{{":
                depth += 1
                i += 2
            elif line[i : i + 2] == "}}":
                depth -= 1
                i += 2
                if depth == 0:
                    end = i
                    break
            else:
                i += 1
        content = line[2 : end - 2] if end else line[2:-2]
        records.append(content[len("nat fs g player|") :])
    return records


def split_params(s):
    """Split on `|` but not inside [[...]] or {{...}} — wikilinks/templates
    can themselves contain pipes, e.g. [[Club|Display]]."""
    parts, current = [], []
    depth_brace = depth_bracket = 0
    i, n = 0, len(s)
    while i < n:
        two = s[i : i + 2]
        if two == "{{":
            depth_brace += 1
            current.append(two)
            i += 2
        elif two == "}}":
            depth_brace -= 1
            current.append(two)
            i += 2
        elif two == "[[":
            depth_bracket += 1
            current.append(two)
            i += 2
        elif two == "]]":
            depth_bracket -= 1
            current.append(two)
            i += 2
        elif s[i] == "|" and depth_brace == 0 and depth_bracket == 0:
            parts.append("".join(current))
            current = []
            i += 1
        else:
            current.append(s[i])
            i += 1
    parts.append("".join(current))
    return parts


def parse_players(wikitext):
    players = []
    for params_str in extract_player_records(wikitext):
        params = {}
        for part in split_params(params_str):
            if "=" not in part:
                continue
            k, v = part.split("=", 1)
            params[k.strip()] = v.strip()
        club = strip_links(params["club"]) if params.get("club") else None
        players.append({"no": params.get("no"), "sortname": params.get("sortname", ""), "club": club})
    return players


def normalize(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", re.sub(r"[^a-zA-Z ]", "", s).lower().strip())


def last_name_from_sortname(sortname):
    return sortname.split(",")[0].strip() if "," in sortname else sortname.strip()


def match_club(fifa_player, wiki_by_last):
    """Match a FIFA squad entry (name like 'Lionel MESSI') to a Wikipedia
    player by last name (with shirt-number tiebreak), falling back to a
    substring check for multi-word surnames (e.g. 'Mac Allister')."""
    tokens = fifa_player["name"].split()
    upper_tokens = [t for t in tokens if t.isalpha() and t == t.upper() and len(t) > 1]
    fifa_last = " ".join(upper_tokens) if upper_tokens else tokens[-1]
    fifa_last_norm = normalize(fifa_last)
    fifa_full_norm = normalize(fifa_player["name"])

    candidates = wiki_by_last.get(fifa_last_norm, [])
    if len(candidates) == 1:
        return candidates[0]
    if len(candidates) > 1:
        for c in candidates:
            if c["no"] and fifa_player.get("number") is not None and str(fifa_player["number"]) == str(c["no"]):
                return c
        return candidates[0]
    for last_norm, group in wiki_by_last.items():
        if last_norm and (last_norm in fifa_full_norm or fifa_last_norm in last_norm):
            return group[0]
    return None


def main():
    sections = fetch_sections()
    team_sections = [(int(s["index"]), s["line"]) for s in sections if s["line"] in SECTION_TO_SLUG]
    print(f"Found {len(team_sections)} team sections")

    with open(SQUADS_PATH) as f:
        data = json.load(f)
    squads = data["squads"]

    total_matched = 0
    total_players = 0
    unmatched_log = []

    for idx, title in team_sections:
        slug = SECTION_TO_SLUG[title]
        fifa_players = squads.get(slug, {}).get("players", [])
        if not fifa_players:
            print(f"  SKIP {title}: no FIFA squad data yet for {slug}")
            continue

        wiki_players = parse_players(fetch_wikitext(idx))
        wiki_by_last = {}
        for wp in wiki_players:
            wiki_by_last.setdefault(normalize(last_name_from_sortname(wp["sortname"])), []).append(wp)

        matched = 0
        for fp in fifa_players:
            chosen = match_club(fp, wiki_by_last)
            if chosen and chosen.get("club"):
                fp["club"] = chosen["club"]
                matched += 1
            elif not fp.get("club"):
                unmatched_log.append(f"{slug}: {fp['name']!r} (no={fp.get('number')})")

        total_matched += matched
        total_players += len(fifa_players)
        print(f"  {title:28s} -> {slug:20s} matched {matched}/{len(fifa_players)}")
        time.sleep(1.5)

    with open(SQUADS_PATH, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\nTOTAL matched {total_matched}/{total_players}")
    if unmatched_log:
        print(f"Unmatched ({len(unmatched_log)}):")
        for line in unmatched_log:
            print(f"  {line}")


if __name__ == "__main__":
    main()
