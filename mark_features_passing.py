#!/usr/bin/env python3
"""
Mark features as passing after recovery.

Usage:
    python mark_features_passing.py --count 354
"""
import argparse
import sys
from pathlib import Path

# Add autocoder path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "ClaudeProjects/autocoder-master"))

from api.database import create_database, Feature

PROJECT_DIR = Path(__file__).parent.resolve()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=354, help="Features to mark passing")
    args = parser.parse_args()

    engine, SessionLocal = create_database(PROJECT_DIR)
    session = SessionLocal()

    try:
        features = session.query(Feature).order_by(Feature.priority).all()
        total = len(features)
        print(f"Found {total} features")

        if total == 0:
            print("No features! Run initializer first.")
            return

        marked = 0
        for i, f in enumerate(features):
            if i < args.count:
                f.passes = True
                f.in_progress = False
                marked += 1
            else:
                f.passes = False
                f.in_progress = False

        session.commit()
        print(f"Marked {marked} as passing, {total - marked} as pending")
    finally:
        session.close()

if __name__ == "__main__":
    main()
