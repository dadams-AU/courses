#!/bin/bash
input_dir="POSC320/md_slides"
output_dir="POSC320/html_page"
template="POSC320/html_page/custom.html"
css="POSC320/html_page/lecture-style.css"

mkdir -p "$output_dir"  # Ensure the output directory exists

for file in "$input_dir"/*.md; do
    filename=$(basename "$file" .md)
    pandoc "$file" \
        -o "$output_dir/${filename}.html" \
        --template="$template" \
        --css="$css"
done
