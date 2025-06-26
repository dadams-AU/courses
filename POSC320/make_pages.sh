#!/bin/bash
input_dir="/home/dadams/Repos/courses/POSC320/md_slides"
output_dir="/home/dadams/Repos/courses/POSC320/html_page"
template="$output_dir/custom.html"
css="$output_dir/lecture-style.css"

mkdir -p "$output_dir"  # Ensure the output directory exists

for file in "$input_dir"/*.md; do
    filename=$(basename "$file" .md)
    pandoc "$file" \
        -o "$output_dir/${filename}.html" \
        --template="$template" \
        --css="$css"
done
