import { Task, BuiltTaskResult, BuildContext, ComponentResult } from '@teambit/builder';
import { Linter } from './linter';

export class LintTask implements Task {
  constructor(readonly name = 'lint') {}

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const linter: Linter = context.env.getLinter();
    const results = await linter.lint(context);
    const componentsResults = results.results.map(
      (lintResult): ComponentResult => {
        return {
          component: lintResult.component,
          metadata: {
            output: lintResult.output,
            results: lintResult.results,
          },
          errors: [],
        };
      }
    );

    return {
      componentsResults,
    };
  }
}
