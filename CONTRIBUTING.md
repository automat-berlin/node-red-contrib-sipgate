# Contributing guidelines

We welcome all contributions. Read further to know the details.

## Bugs, improvements, new features

Information about bugs, possible improvements and desired features are always welcome.

You do not need to write the code. Just let us know what issue you found and we will be happy to work on it.

Create an issue or a pull request. For other inquiries, please contact us via email info@automat.berlin.

## Code conventions

We use [ESLint](https://www.npmjs.com/package/eslint) and [Prettier](https://www.npmjs.com/package/prettier) together with [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged) to enforce styling rules we agreed on.

The role of the tools mentioned above is:

- [husky](https://www.npmjs.com/package/husky) - to set up a pre-commit hook
- [lint-staged](https://www.npmjs.com/package/lint-staged) - to run commands against files to be commited
- [prettier](https://www.npmjs.com/package/prettier) - to format the code
- [eslint](https://www.npmjs.com/package/eslint) - to lint the code

Thanks to these tools when you try to make a commit, your code style will be automatically verified.

Your commit will fail if verification fails. You should get information about issues in your code.

Try to run following commands to automatically solve the issues:

```
$ npm run format
$ npm run lint
```

If all issues are solved, you are ready to commit your code.

Note that some issues may not be solved automatically and require to be manually solved.

## Git commit messages

Add type prefix to commit subject as described here: https://seesparkbox.com/foundry/semantic_commit_messages.

Use the imperative, present tense (e.g. "change" not "changed" nor "changes").

Check commit history to see examples.
