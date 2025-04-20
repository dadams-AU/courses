#!/usr/bin/env python3
"""
auto_tag_pdfs.py

Recursively finds all PDF files under a given directory and applies accessibility tagging using Ghostscript,
outputting tagged copies into a specified directory while preserving the subdirectory structure.

Usage:
    python auto_tag_pdfs.py --root /path/to/source_pdfs --out /path/to/tagged_pdfs

Requirements:
    - Python 3.6+
    - Ghostscript installed (`gs` on PATH)

The script uses Ghostscript's PDF/UA auto-tagging capabilities:
  -dPDFUACompliance=true
  -dPDFACompatibilityPolicy=1

Example:
    python auto_tag_pdfs.py -r ./converted -o ./tagged

This will process all `.pdf` under `./converted`, producing accessibility-tagged versions in `./tagged`.
"""
import os
import sys
import argparse
import subprocess
import logging
import shutil


def check_ghostscript():
    """Ensure Ghostscript executable is available."""
    if shutil.which('gs') is None:
        logging.error("Ghostscript ('gs') not found on PATH. Please install Ghostscript.")
        sys.exit(1)


def tag_pdf(input_path: str, output_path: str) -> None:
    """Run Ghostscript to auto-tag a PDF for accessibility."""
    args = [
        'gs',
        '-dBATCH',
        '-dNOPAUSE',
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.7',
        '-dPDFUACompliance=true',
        '-dPDFACompatibilityPolicy=1',
        f'-sOutputFile={output_path}',
        input_path
    ]
    subprocess.run(args, check=True)


def main(root_dir: str, output_dir: str) -> None:
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    check_ghostscript()

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith('.pdf'):
                source_pdf = os.path.join(dirpath, filename)
                # Determine relative folder path
                rel_folder = os.path.relpath(dirpath, root_dir)
                target_folder = os.path.join(output_dir, rel_folder)
                os.makedirs(target_folder, exist_ok=True)

                # Tagged PDF uses the same filename
                tagged_pdf = os.path.join(target_folder, filename)

                logging.info(f"Tagging: {source_pdf} -> {tagged_pdf}")
                try:
                    tag_pdf(source_pdf, tagged_pdf)
                except subprocess.CalledProcessError as e:
                    logging.error(f"Failed to tag {source_pdf}: {e}")

    logging.info("Accessibility tagging complete.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Auto-tag PDFs for accessibility using Ghostscript (PDF/UA)."
    )
    parser.add_argument(
        '--root', '-r',
        default='.',
        help='Root directory containing PDFs to tag (default: current directory)'
    )
    parser.add_argument(
        '--out', '-o',
        default='./tagged_pdfs',
        help='Destination directory for tagged PDFs (default: ./tagged_pdfs)'
    )
    args = parser.parse_args()
    main(args.root, args.out)
