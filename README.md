# Public Administration and Public Policy Courses at Cal State Fullerton

This repository holds the lecture decks, handouts, and reference files behind [courses.dadams.io](https://courses.dadams.io) for undergraduate and graduate courses in Public Administration and Public Policy at California State University, Fullerton. Syllabi live in [dadams-AU/syllabi](https://github.com/dadams-AU/syllabi).

## Table of Contents

- [Public Administration and Public Policy Courses at Cal State Fullerton](#public-administration-and-public-policy-courses-at-cal-state-fullerton)
  - [Table of Contents](#table-of-contents)
  - [Undergraduate Courses](#undergraduate-courses)
  - [Graduate Courses](#graduate-courses)
  - [MPA Course Reference Materials](#mpa-course-reference-materials)
  - [Additional Resources](#additional-resources)
  - [Contributing](#contributing)
  - [License](#license)

## Undergraduate Courses

Here you will find the syllabi and other materials related to the undergraduate courses:

- **Course POSC 315**: [Introduction to Public Policy](/POSC315_asynch)
  - Syllabus (Summer 2026): [Download here](https://github.com/dadams-AU/syllabi/blob/main/POSC%20315%20Intro%20Policy/2026%20Summer/posc315_summer_2026.pdf)
  - Past syllabi: [All terms](https://github.com/dadams-AU/syllabi/tree/main/POSC%20315%20Intro%20Policy)
  - Lectures (slides and videos): [View here](https://courses.dadams.io/#posc315-async)
  - Handouts: [View here](https://courses.dadams.io/POSC315_asynch/posc315_async_handouts.html)

## Graduate Courses

This section includes information and links to the graduate courses:

- **Course POSC 521**: [MPA Capstone Seminar](/POSC521/)
  - Syllabus (Fall 2026): [Download here](https://github.com/dadams-AU/syllabi/blob/main/POSC%20521%20MPA%20Capstone/2026-27%20Fall/posc521_2026_fall.pdf)
  - Past syllabi: [All terms](https://github.com/dadams-AU/syllabi/tree/main/POSC%20521%20MPA%20Capstone)
  
## MPA Course Reference Materials

- POSC 521 Reference Materials
  - [POSC 521 Course Bibliography BibTeX file](/POSC521/521.bib)
  - [POSC 521 Course Bibliography JSON file](/POSC521/521.json)

## Additional Resources

- [Department Website](https://hss.fullerton.edu/paj/PublicAdministration/pub_admin_gr.aspx)
- [University Library Resources](https://www.library.fullerton.edu/)

## Contributing

If you find any mistakes or have suggestions, please feel free to open an issue or a pull request.

## License

All materials in this repository are shared under the terms in [license.md](license.md).


## Editing the site

- `index.html` holds the lecture lists. To add a lecture or deck, copy an existing `<div class="lecture-item">` block into the right unit; the lecture search and counts pick it up automatically.
- Pages that share the site header and footer start with `layout: site` front matter. The header, nav, and footer live in `_includes/site-*.html`.
- `css/custom.css` is a verbatim copy of the theme from [dadams-AU/mainweb](https://github.com/dadams-AU/mainweb); re-copy it to stay in sync. Styles specific to this site go in `css/courses.css`.
- `favicon.ico` and `apple-touch-icon.png` are copies of dadams.io's, and `images/og-card.png` is drawn by mainweb's `tools/drawings.py og-courses`.
- Decks keep their sources beside them. POSC 315's Beamer decks build from `POSC315_asynch/lectures_beamer/*.tex` (metropolis theme files included); its Marp decks build from `POSC315_asynch/lectures_md/*.md` into `lectures_md/html/`, using the `marp` and `marp_light` themes in that folder (`POSC315_asynch/marp.css` is the untagged original).
- If `index.html` and this README don't link to a file, and no linked deck is built from it, it doesn't belong here. Retired material stays in the git history: `git log --diff-filter=D --name-only` finds it, and `git checkout <commit>^ -- <path>` brings it back.
