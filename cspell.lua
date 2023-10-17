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
		getSpellCheckOptions = function()
			local cspell = require("cspell")
			local isNullLsLoaded, null_ls = pcall(require, "null-ls")
			if not isNullLsLoaded then
				return
			end
		
			local nullLsBuiltins = null_ls.builtins
		
			local spellCheckSources = {
		
				-- spell check
				nullLsBuiltins.diagnostics.codespell,
				nullLsBuiltins.diagnostics.misspell,
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
				sources = spellCheckSources,
				debounce = 200,
				debug = true,
			}
		end,
	},
}
