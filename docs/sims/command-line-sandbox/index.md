---
title: Command Line Sandbox
description: A real station file system, a real permission model, and rm with no undo - none of it attached to a real machine.
image: /sims/command-line-sandbox/command-line-sandbox.png
og:image: /sims/command-line-sandbox/command-line-sandbox.png
twitter:image: /sims/command-line-sandbox/command-line-sandbox.png
social:
   cards: false
quality_score: 0
---

# Command Line Sandbox

<iframe src="main.html" height="656px" width="100%" scrolling="no"></iframe>

[Run the Command Line Sandbox MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Beginners are afraid of the command line, and that fear is rational: `rm` has no undo.
This is a sandbox with the station file system from the chapter already in it, so you can
build fluency and make every destructive mistake you like without owning a Pi.

The terminal and the **file tree sit side by side on purpose**. Beginners lose track of
where they are, and watching the tree highlight move with every `cd` builds the spatial
model that `pwd` alone does not.

Fifteen commands work, with realistic output: `pwd`, `ls`, `ls -l`, `cd`, `cat`, `head`,
`tail`, `mkdir`, `cp`, `mv`, `rm`, `rm -r`, `chmod`, `df -h`, `man` and `clear`. Anything
else tells you what is supported rather than just failing. `logger.py`, `readings.csv`,
`config.json` and `station-logger.service` all contain their real contents, so `cat` and
`tail` show you something worth reading.

**Task 5 is the one to do properly.** Run `./logger.py` before you do anything else and
bash says:

```
bash: ./logger.py: Permission denied
```

Then `ls -l`, and **hover any character of the permission block** for a tooltip naming it.
There is no `x` anywhere in `-rw-r--r--`. Fix it with `chmod +x logger.py`, watch the block
become `-rwxr-xr-x`, watch the tree mark the file with a green `*`, and run it again. That
sequence is one of the two permission problems the chapter warns will bite you, and it
looks exactly like a software bug until you know to check.

**The deletion demonstration is the point, not a gimmick.** Type `rm readings.csv` and it
is gone immediately, with no confirmation, and a red message saying so. In the sandbox you
press Reset. On a real station that data does not come back. Typing `rm -rf /` brings up a
full-screen explanation of what that command does rather than pretending to run it.

## How to Use

- Type into the prompt and press Enter. **Up** and **Down** recall earlier commands.
- Work down the **task list** on the right. It ticks itself off as you go.
- **Hover a permission character** in `ls -l` output to find out what it means.
- Try `man tail`, then `tail -n 5 readings.csv`.
- Delete something. Then press **Reset the sandbox**.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/command-line-sandbox/main.html"
        height="656px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Apply (L3)

### Prerequisites
- Chapter 12 sections on the file system, shell commands and file permissions

### Activities

1. **Seven tasks (12 min)**: Work through the whole task list without help. Write down the exact command you used for each.
2. **Read a permission block (6 min)**: Run `ls -l /dev` and explain, character by character, why an ordinary user cannot open `i2c-1`. Connect this to the second permission problem in the chapter.
3. **Break it on purpose (7 min)**: Delete `readings.csv`, then try to `cat` it. Write two sentences on what you would do differently on a real station, then press Reset.

### Assessment
- Navigates to a named directory and confirms the location with `pwd`.
- Diagnoses a missing execute bit from `ls -l` output and fixes it with `chmod`.
- States what happens to a file removed with `rm` and how to avoid needing to find out.

## References

1. [Ubuntu Server documentation](https://documentation.ubuntu.com/server/) - the distribution this sandbox imitates.
2. [Wikipedia: File-system permissions](https://en.wikipedia.org/wiki/File-system_permissions) - the rwx model, and the numeric modes `chmod` also accepts.
3. [Wikipedia: Filesystem Hierarchy Standard](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard) - why `/etc`, `/var`, `/dev` and `/usr` are where they are.
4. [Wikipedia: Everything is a file](https://en.wikipedia.org/wiki/Everything_is_a_file) - the idea behind `/dev/i2c-1`.
