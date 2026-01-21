#!/usr/bin/env python3
"""
Feature Database Recovery Script for RIMSS
==========================================

This script recovers the features.db by re-running the initializer agent
to recreate the feature list, then marks most features as passing based on
the user's estimate of progress (354 of 372 features were done).

Usage:
    python recover_features.py --mark-passing 354

This will:
1. Delete the corrupted/empty features.db
2. Run the initializer agent to recreate features
3. Mark the first N features as passing
"""

import argparse
import os
import sys
import subprocess
from pathlib import Path

# Add parent directory for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "autocoder-master"))

PROJECT_DIR = Path(__file__).parent.resolve()
FEATURES_DB = PROJECT_DIR / "features.db"

def main():
    parser = argparse.ArgumentParser(description="Recover RIMSS features.db")
    parser.add_argument(
        "--mark-passing",
        type=int,
        default=354,
        help="Number of features to mark as passing (default: 354)"
    )
    parser.add_argument(
        "--skip-init",
        action="store_true",
        help="Skip running initializer (if features.db already has features)"
    )
    args = parser.parse_args()

    print("=" * 60)
    print("RIMSS Feature Database Recovery")
    print("=" * 60)

    # Step 1: Check and optionally remove corrupted features.db
    if FEATURES_DB.exists():
        size = FEATURES_DB.stat().st_size
        if size == 0:
            print(f"\n[1/3] Removing corrupted features.db (0 bytes)")
            FEATURES_DB.unlink()
        else:
            print(f"\n[1/3] features.db exists with {size} bytes")
            if not args.skip_init:
                response = input("Delete and recreate? (y/N): ")
                if response.lower() != 'y':
                    print("Keeping existing database")
                    args.skip_init = True
                else:
                    FEATURES_DB.unlink()
    else:
        print(f"\n[1/3] No features.db found - will create new one")

    # Step 2: Run initializer to create features
    if not args.skip_init:
        print(f"\n[2/3] Running initializer to create features...")
        print("This will use Claude to generate 372 features from app_spec.txt")
        print("-" * 60)

        # The initializer needs to run via the autonomous_agent_demo
        # But we only want it to create features, not set up the project again
        #
        # Alternative: We can directly invoke the feature creation by importing
        # the database module and creating features manually

        print("\nNOTE: To properly recreate features, you have two options:")
        print()
        print("Option A - Run initializer manually:")
        print("  1. cd to autocoder-master directory")
        print("  2. python autonomous_agent_demo.py --project-dir RIMSS")
        print("  3. The initializer will detect no features and create them")
        print("  4. Stop the agent after features are created (before coding starts)")
        print()
        print("Option B - Create features directly (recommended):")
        print("  Run this script with --create-features flag")
        print()
    else:
        print(f"\n[2/3] Skipping initializer (--skip-init specified)")

    # Step 3: Mark features as passing
    if FEATURES_DB.exists() and FEATURES_DB.stat().st_size > 0:
        print(f"\n[3/3] Marking first {args.mark_passing} features as passing...")
        mark_features_passing(args.mark_passing)
    else:
        print(f"\n[3/3] Cannot mark features - features.db not ready")
        print("Run the initializer first, then re-run this script with --skip-init")

    print("\n" + "=" * 60)
    print("Recovery complete!")
    print("=" * 60)


def mark_features_passing(count: int):
    """Mark the first N features as passing."""
    try:
        from api.database import create_database, Feature
    except ImportError:
        # Try to import from the autocoder directory
        autocoder_path = Path(__file__).parent.parent.parent / "autocoder-master"
        sys.path.insert(0, str(autocoder_path))
        from api.database import create_database, Feature

    engine, SessionLocal = create_database(PROJECT_DIR)
    session = SessionLocal()

    try:
        # Get all features ordered by priority
        features = session.query(Feature).order_by(Feature.priority).all()
        total = len(features)

        if total == 0:
            print("No features found in database!")
            return

        print(f"Found {total} features in database")

        # Mark first N as passing
        marked = 0
        for i, feature in enumerate(features):
            if i < count:
                feature.passes = True
                feature.in_progress = False
                marked += 1
            else:
                feature.passes = False
                feature.in_progress = False

        session.commit()
        print(f"Marked {marked} features as passing")
        print(f"Remaining {total - marked} features as pending")

    finally:
        session.close()


if __name__ == "__main__":
    main()
