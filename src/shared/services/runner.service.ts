import { Injectable, Logger } from "@nestjs/common";
import { exec } from 'child_process';

export interface ExecOut {
  stdout: string;
  stderr: string;
}

const execP = (cmd: string) => new Promise<ExecOut>((res, rej) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) rej(err);
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
      try {
        await execP(condition);
      } catch (err) {
        throw {
          exitCode: err.code,
          index,
        };
      }
    }
    return true;
  }
}