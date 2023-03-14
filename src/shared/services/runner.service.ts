import { Injectable, Logger } from "@nestjs/common";
import { exec } from 'child_process';

export interface ExecOut {
  stdout: string;
  stderr: string;
  exitCode?: number;
}

const execP = (cmd: string) => new Promise<ExecOut>((res, rej) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) res({ exitCode: err.code, stdout, stderr });
    res({ stdout, stderr });
  });
});

@Injectable()
export default class RunnerService {
  constructor() { }

  /**
   * Runs the list of commands, and returns an array with outputs for each command.
   */
  async runCommands(commands: string[]): Promise<ExecOut[]> {
    const outs: ExecOut[] = [];
    for (const command of commands) {
      const out = await execP(command);
      outs.push(out);
      if (out.exitCode) {
        Logger.log("Execution stopped: found nonzero exit code");
      }
    }
    return outs;
  }

  /**
   * Runs the list of commands, and returns true if all exit codes are zero.
   * 
   * Short-circuits when first non-zero is encountered.
   */
  async runConditions(conditions: string[]) {
    if (!conditions) return;
    for (const [condition, index] of conditions.map<[string, number]>((c, i) => [c, i])) {
      const { exitCode } = await execP(condition);
      if (exitCode) {
        throw {
          exitCode,
          index,
        };
      }
    }
    return true;
  }
}