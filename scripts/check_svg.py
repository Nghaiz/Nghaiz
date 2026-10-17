"""Fail if any generated SVG is not well-formed XML.

Browsers silently drop an <img> whose SVG fails to parse (a repeated attribute is enough), so a
broken badge or card would otherwise ship as an empty box. Run after every build:

    python scripts/check_svg.py
"""
import glob
import sys
import xml.etree.ElementTree as ET

files = sorted(glob.glob("assets/**/*.svg", recursive=True))
bad = 0
for path in files:
    try:
        ET.parse(path)
    except ET.ParseError as err:
        bad += 1
        print(f"INVALID {path}: {err}")
print(f"checked {len(files)} SVG files, {bad} invalid")
sys.exit(1 if bad else 0)
