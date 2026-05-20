# Plume

A lightweight Hugo documentation theme without any external dependencies.

![Screenshot](https://github.com/Dobefu/hugo-theme-plume/blob/main/images/screenshot.png?raw=true)

## Features

- [x] Zero dependencies
- [x] Responsive design
- [x] Automatic dark mode
- [x] Syntax highlighting
- [x] Mobile navigation
- [x] Table of contents
- [x] SEO optimisation
- [x] Multi-language support (i18n)
- [x] Web app manifest
- [x] Search

## Installation (new site)

Create a new Hugo site with Plume:

```bash
hugo new site mysite
cd mysite
hugo mod init github.com/<username>/<site>
hugo mod tidy
hugo mod get github.com/Dobefu/hugo-theme-plume
```

Add to your `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/Dobefu/hugo-theme-plume"
```

## Installation (existing site)

### As a Hugo Module

```bash
hugo mod init github.com/<username>/<site>
hugo mod tidy
hugo mod get github.com/Dobefu/hugo-theme-plume
```

Add to your `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/Dobefu/hugo-theme-plume"
```

### As a Git Submodule

```bash
git submodule add https://github.com/Dobefu/hugo-theme-plume.git themes/plume
```

Add to your `hugo.toml`:

```toml
theme = "plume"
```

## Configuration

To configure the theme, update the `hugo.toml` file with the following:

```toml
[module]
  [[module.imports]]
    path = "github.com/Dobefu/hugo-theme-plume"

[markup]
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 4

  [markup.highlight]
    lineNos = true
    noClasses = false

  [markup.goldmark]
    [markup.goldmark.extensions]
      strikethrough = false

      [markup.goldmark.extensions.extras]
        delete.enable = true
        mark.enable = true
        insert.enable = true
        subscript.enable = true
        superscript.enable = true

      [markup.goldmark.extensions.passthrough]
        enable = true

        [markup.goldmark.extensions.passthrough.delimiters]
          block = [['\[', '\]']]
          inline = [['\(', '\)']]

```

## License

MIT License - see [LICENSE](LICENSE) for details.
