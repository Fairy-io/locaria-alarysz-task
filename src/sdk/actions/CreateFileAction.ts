import fs from 'fs/promises';
import { Action } from '.';

export class CreateFileAction extends Action<
    { content: string; path: string },
    void
> {
    private path: string | undefined = undefined;

    protected async execute(args: {
        content: string;
        path: string;
    }): Promise<void> {
        const { content, path } = args;

        await fs.writeFile(path, content);

        this.path = path;
    }

    protected async rollback(): Promise<void> {
        if (!this.path) {
            return;
        }

        await fs.unlink(this.path);
    }
}
