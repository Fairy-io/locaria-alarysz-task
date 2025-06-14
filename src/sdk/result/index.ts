export class Result<T extends { [key: string]: any }, V> {
    private value: any = null;
    private errorKey: any = null;
    private errorValue: any = null;

    ok(value: V) {
        this.value = value;
    }

    error<K extends keyof T>(key: K, value: T[K]) {
        this.errorKey = key;
        this.errorValue = value;
    }

    unwrap(): { ok: V } {
        if (this.errorKey) {
            throw this.errorValue;
        }

        if (!this.value) {
            throw new Error('Result value is not set');
        }

        return { ok: this.value };
    }

    expect<K extends keyof T>(
        keys: K[],
    ): { ok?: V } & Partial<Pick<T, K>> {
        if (this.errorKey && keys.includes(this.errorKey)) {
            return {
                [this.errorKey]: this.errorValue,
            } as any;
        }

        if (this.value) {
            return { ok: this.value } as any;
        }

        throw this.errorValue;
    }
}
