-- Example config with lazyvim
return {
	-- Auto install those tools with mason
	{
		"williamboman/mason.nvim",
		opts = {
			ensure_installed = {
				-- code spell
				"codespell",
				"misspell",
				"cspell",
			},
		},
	},
	-- Set up null-ls to check spelling
	{
		"nvimtools/none-ls.nvim",
		keys = {
			{ "<leader>cn", "<cmd>NullLsInfo<cr>", desc = "NullLs Info" },
		},
		dependencies = { "mason.nvim", "davidmh/cspell.nvim" },
		event = { "BufReadPre", "BufNewFile" },
		opts = function()
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
					-- Set the severity to HINT for unknown words
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
		end,
	},
}
