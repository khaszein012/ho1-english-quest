<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Student profile labels live in the existing quest state and never partition or reset progress, so renaming is safe for older saves.
- Shared quest presentation tokens and responsive screen layouts live in src/styles.css; the quest shell owns desktop navigation, leaving lesson content config-driven.
