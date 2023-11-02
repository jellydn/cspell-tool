# cspell-tool

[![Version](https://img.shields.io/npm/v/cspell-tool.svg)](https://npmjs.org/package/cspell-tool)
[![Downloads/week](https://img.shields.io/npm/dw/cspell-tool.svg)](https://npmjs.org/package/cspell-tool)
[![License](https://img.shields.io/npm/l/cspell-tool.svg)](https://github.com/jellydn/cspell-tool/blob/master/package.json)![Prerequisite](https://img.shields.io/badge/node-%3E%3D18.17.0-blue.svg)
[![Twitter: jellydn](https://img.shields.io/twitter/follow/jellydn.svg?style=social)](https://twitter.com/jellydn)

<p align="center">
  <em>Keep your project's spelling in check with cspell-tool.</em>
</p>

[![IT Man - Eliminate Typos in Your Code with Neovim [Vietnamese]](https://i.ytimg.com/vi/3IwMd77_P8E/hqdefault.jpg)](https://www.youtube.com/watch?v=3IwMd77_P8E)

## Table of Contents

<!--toc:start-->

- [Usage](#usage)
- [Installation](#installation)
- [Features](#features)
  - [Usage with Neovim and null-ls](#usage-with-neovim-and-null-ls)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Author](#author)
- [Show Your Support](#show-your-support)
<!--toc:end-->

## Usage

Run the following command in your project's root directory to check for spelling issues:

```sh
npx cspell-tool@latest
```

[![Demo](https://i.gyazo.com/a8c681a83b65620f2277b2c9a16a46ef.gif)](https://gyazo.com/a8c681a83b65620f2277b2c9a16a46ef)

## Installation

Install as a development dependency in your project:

```sh
npm install --save-dev cspell-tool
```

Or globally:

```sh
npm install -g cspell-tool
```

## Features

- Supports multiple file formats like `.md`, `.ts`, `.lua` `.json`, `.yaml` and `.css`.
- Easily customizable via `cspell.json`.
- Extends your project-specific dictionary.

### Usage with Neovim and null-ls

This assumes you have [`mason.nvim`](https://github.com/williamboman/mason.nvim) and [`null-ls.nvim`](https://github.com/nvimtools/none-ls.nvim) installed.

1. **Installing cSpell with Mason**

   Make sure your `mason.nvim` configuration in your `init.lua` includes `cspell` under `ensure_installed`:

   ```lua
   ensure_installed = {
     -- code spell
     "codespell",
     "misspell",
     "cspell",
   },
   ```

2. **Setting Up null-ls**

   Add the following code to your `init.lua` to set up `null-ls` for spell checking:

   ```lua
   local cspell = require("cspell")
   local ok, none_ls = pcall(require, "null-ls")
   if not ok then
     return
   end

   local b = none_ls.builtins
   local sources = {
     -- spell check
     b.diagnostics.codespell,
     b.diagnostics.misspell,
     -- cspell
     cspell.diagnostics.with({
       diagnostics_postprocess = function(diagnostic)
         diagnostic.severity = vim.diagnostic.severity["HINT"]
       end,
     }),
     cspell.code_actions,
   }

   return {
     sources = sources,
     debounce = 200,
     debug = true,
   }
   ```

More details can be found in [`cspell example config with lazyvim`](./cspell.lua).

[![Neovim Demo](https://i.gyazo.com/99f48ffbd1d3577d45e3474a98801120.gif)](https://gyazo.com/99f48ffbd1d3577d45e3474a98801120)

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

## Acknowledgements

- [zx](https://github.com/google/zx) for making scripting easier.
- [cspell](https://github.com/streetsidesoftware/cspell) for being the backbone of this tool.

## Author

👤 **Huynh Duc Dung**

- Website: [productsway.com](https://productsway.com)
- Twitter: [@jellydn](https://twitter.com/jellydn)
- GitHub: [@jellydn](https://github.com/jellydn)

## Show Your Support

If this guide has been helpful, please give it a ⭐️.

[![kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/dunghd)
[![paypal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/dunghd)
[![buymeacoffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/dunghd)
