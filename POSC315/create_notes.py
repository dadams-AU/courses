#!/usr/bin/env python3
"""
convert_html_to_md_and_pdf.py

Recursively finds every `index.html` file under a given directory, converts it to Markdown (with YAML front matter)
and PDF using Pandoc, then writes the outputs to a separate directory preserving subdirectory structure.

The Markdown files have `index.md` names (with YAML prepended), while PDFs are named after their containing
folder (e.g., `foldername.pdf`).

Usage:
    python convert_html_to_md_and_pdf.py [--root ROOT_DIR] [--out OUTPUT_DIR]

Requirements:
    - Python 3.6+
    - Pandoc installed and on your PATH

Example:
    python convert_html_to_md_and_pdf.py --root ./site --out ./converted

This will process all `index.html` files under `./site`, producing `index.md` (with YAML) and
`<foldername>.pdf` in `./converted/<relative_path>/`.
"""
import os
import subprocess
import argparse
import logging
import sys

# YAML front matter to prepend to each Markdown file
YAML_HEADER = """---
fontsize: 10pt
geometry: margin=1in
mainfont: "DejaVu Sans"
output:
  pdf_document:
    latex_engine: xelatex
header-includes:
  - \\usepackage{fancyhdr}
  - \\pagestyle{fancy}
  - \\fancyhf{}
  - \\fancyhead[L]{\\textbf{POSC 315 | Week 11}}
  - \\fancyhead[R]{\\textbf{Policy Design and Tools}}
  - \\fancyfoot[C]{\\thepage}
  - \\setlength{\\headheight}{15pt}
---
"""

def check_pandoc():
    """Ensure Pandoc is available on PATH, exit if not."""
    try:
        subprocess.run(["pandoc", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        logging.error("Pandoc is not installed or not found on PATH.")
        sys.exit(1)


def prepend_yaml(md_path: str) -> None:
    """Prepend YAML_HEADER to the markdown file if not already present."""
    with open(md_path, 'r+', encoding='utf-8') as f:
        content = f.read()
        if not content.startswith('---'):
            f.seek(0, 0)
            f.write(YAML_HEADER + '\n' + content)
            logging.info(f"Prepended YAML to: {md_path}")


def convert_file(html_path: str, md_path: str, pdf_path: str) -> None:
    """Convert HTML to Markdown (with YAML) and then to PDF."""
    # Convert to Markdown
    try:
        subprocess.run([
            'pandoc', html_path,
            '-f', 'html',
            '-t', 'markdown',
            '-o', md_path
        ], check=True)
        logging.info(f"Markdown generated: {md_path}")
    except subprocess.CalledProcessError as e:
        logging.error(f"Failed to convert to Markdown: {html_path}: {e}")
        return

    # Prepend YAML front matter
    prepend_yaml(md_path)

    # Convert Markdown (with YAML) to PDF
    try:
        subprocess.run([
            'pandoc', md_path,
            '-o', pdf_path
        ], check=True)
        logging.info(f"PDF generated: {pdf_path}")
    except subprocess.CalledProcessError as e:
        logging.error(f"Failed to convert to PDF: {md_path}: {e}")


def main(root_dir: str, output_dir: str) -> None:
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    check_pandoc()

    for dirpath, _, filenames in os.walk(root_dir):
        if 'index.html' not in filenames:
            continue

        html_file = os.path.join(dirpath, 'index.html')
        rel_dir = os.path.relpath(dirpath, root_dir)
        target_dir = os.path.join(output_dir, rel_dir)
        os.makedirs(target_dir, exist_ok=True)

        # Markdown always named index.md
        md_path = os.path.join(target_dir, 'index.md')

        # PDF named after folder containing index.html
        folder_name = os.path.basename(dirpath) or os.path.basename(os.path.abspath(root_dir))
        pdf_filename = f"{folder_name}.pdf"
        pdf_path = os.path.join(target_dir, pdf_filename)

        logging.info(f"Processing: {html_file}")
        convert_file(html_file, md_path, pdf_path)

    logging.info("All conversions complete.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Convert all index.html files to Markdown with YAML and PDF."
    )
    parser.add_argument(
        '--root', '-r',
        default='.',
        help='Root directory to scan (default: current directory)'
    )
    parser.add_argument(
        '--out', '-o',
        default='./converted',
        help='Output directory for generated files (default: ./converted)'
    )
    args = parser.parse_args()
    main(args.root, args.out)

