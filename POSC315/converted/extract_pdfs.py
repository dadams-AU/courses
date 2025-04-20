#!/usr/bin/env python3
"""
extract_pdfs.py

Recursively finds all PDF files under a given root directory and copies them into a specified
output directory. By default, files are flattened (all PDFs in one folder). Optionally, preserve
the directory structure within the output directory.

Usage:
    python extract_pdfs.py --root /path/to/source --out /path/to/destination [--preserve-structure]

Requirements:
    - Python 3.6+

Example:
    python extract_pdfs.py -r ./converted -o ./all_pdfs
    python extract_pdfs.py -r ./converted -o ./preserved_pdfs --preserve-structure

Options:
    --root, -r                Root directory to scan (default: current directory)
    --out, -o                 Destination directory for extracted PDFs (default: ./pdfs)
    --preserve-structure, -p  If set, recreate the relative directory tree under the output dir
"""
import os
import shutil
import argparse
import logging


def main(root_dir: str, output_dir: str, preserve: bool) -> None:
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

    if not os.path.isdir(root_dir):
        logging.error(f"Source directory does not exist: {root_dir}")
        return
    os.makedirs(output_dir, exist_ok=True)

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith('.pdf'):
                source_path = os.path.join(dirpath, filename)
                if preserve:
                    rel_path = os.path.relpath(dirpath, root_dir)
                    target_dir = os.path.join(output_dir, rel_path)
                    os.makedirs(target_dir, exist_ok=True)
                    target_path = os.path.join(target_dir, filename)
                else:
                    target_path = os.path.join(output_dir, filename)
                    # Avoid overwrite: if exists, append a counter
                    base, ext = os.path.splitext(filename)
                    counter = 1
                    while os.path.exists(target_path):
                        target_path = os.path.join(output_dir, f"{base}_{counter}{ext}")
                        counter += 1

                try:
                    shutil.copy2(source_path, target_path)
                    logging.info(f"Copied: {source_path} -> {target_path}")
                except Exception as e:
                    logging.error(f"Failed to copy {source_path}: {e}")

    logging.info("PDF extraction complete.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Extract all PDFs from subdirectories to a single directory")
    parser.add_argument('--root', '-r', default='.', help='Root directory to scan (default: current directory)')
    parser.add_argument('--out', '-o', default='./pdfs', help='Destination directory for PDFs (default: ./pdfs)')
    parser.add_argument('--preserve-structure', '-p', action='store_true', help='Recreate subdirectory tree under output')
    args = parser.parse_args()
    main(args.root, args.out, args.preserve_structure)
