import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { AccountSwitcher } from "../../runtime";
import type { AccountSwitcherContext } from "../../types";
import { errorUtil } from "../../utils";
import { AccountCommand } from "./shared";
import { UNSUPPORTED_ONESHOT } from "./set-subagent-account";

export const useSubagentAccountCommand = (pi: ExtensionAPI, runtime: AccountSwitcher) => {
  new SubagentAccountCommand(pi, runtime).register();
};

class SubagentAccountCommand extends AccountCommand {
  constructor(pi: ExtensionAPI, runtime: AccountSwitcher) {
    super(pi, runtime, {
      name: "accounts:subagent",
      description: "Set a persistent child account preference (one-shot is unsupported)",
    });
  }

  async handler(ctx: AccountSwitcherContext, args?: string): Promise<void> {
    try {
      await this.runtime.load();
      const accounts = this.runtime.getAccounts();

      if (accounts.length === 0) {
        ctx.ui.notify("No accounts configured.", "info");
        return;
      }

      // Interactive: pick an account
      const account = await this.pickGroupedAccount(ctx, accounts, "Account for subagent");
      if (!account) return;

      // Ask about oneshot (default: yes)
      const oneshot = await ctx.ui.confirm(
        "Apply to next subagent only?",
        "Yes = unsupported one-shot (will reject). No = persistent (all inheriting children until cleared).",
      );

      if (oneshot !== false) {
        ctx.ui.notify(UNSUPPORTED_ONESHOT, "error");
        return;
      }
      process.env.PI_ACCOUNT_SWITCHER_CHILD_ID = account.id;

      ctx.ui.notify(`Subagent account set to: ${account.label} (persistent).`, "info");
    } catch (e) {
      ctx.ui.notify(`Failed to set subagent account: ${errorUtil.format(e)}`, "error");
    }
  }
}
