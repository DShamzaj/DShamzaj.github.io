---
title: Issue #2 — Your headline here
date: 2026-11-05
summary: One or two sentences that appear on the newsletter list and under the title.
type: issue
tags: Wazuh, Detection engineering
---

HOW TO PUBLISH A NEW ISSUE
1. Copy this file inside the "posts" folder.
2. Rename the copy, for example: 2026-11-05-issue-02-my-topic.md
   (lowercase, dashes instead of spaces; the name becomes the link)
3. Change the header above:
   - title:   the headline
   - date:    YYYY-MM-DD (newest date shows first)
   - summary: short teaser
   - type:    issue  (a regular newsletter issue)
              trend  (a short post about an industry trend)
   - tags:    comma-separated
4. Delete these instructions and write your post below, in Markdown.
5. Commit and push in GitHub Desktop. The page updates in about 2 minutes.

This file starts with "_" so it never appears on the site.

## A section heading

Normal paragraph text. **Bold**, *italic*, `inline code`, and [a link](https://github.com/DShamzaj).

### A smaller heading

- Bullet point
- Another bullet point

1. Numbered step
2. Next step

> A highlighted quote or key takeaway.

```bash
# a code block
sudo systemctl restart wazuh-manager
```

| Column | Column |
|---|---|
| Table cell | Table cell |

![Image description](https://dshamzaj.github.io/og-image.png)

---
