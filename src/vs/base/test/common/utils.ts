/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as errors from 'vs/base/common/errors';
import * as paths from 'vs/base/common/paths';
import URI from 'vs/base/common/uri';
import { PPromise, TProgressCallback, TPromise, TValueCallback } from 'vs/base/common/winjs.base';

export class DeferredTPromise<T> extends TPromise<T> {

	public canceled: boolean;

	private completeCallback: TValueCallback<T>;
	private errorCallback: (err: any) => void;

	constructor() {
		let captured: any;
		super((c, e) => {
			captured = { c, e };
		}, () => this.oncancel());
		this.canceled = false;
		this.completeCallback = captured.c;
		this.errorCallback = captured.e;
	}

	public complete(value: T) {
		this.completeCallback(value);
	}

	public error(err: any) {
		this.errorCallback(err);
	}

	private oncancel(): void {
		this.canceled = true;
	}
}

export class DeferredPPromise<C, P> extends PPromise<C, P> {

	private completeCallback: TValueCallback<C>;
	private errorCallback: (err: any) => void;
	private progressCallback: TProgressCallback<P>;

	constructor(init: (complete: TValueCallback<C>, error: (err: any) => void, progress: TProgressCallback<P>) => void = (c, e, p) => { }, oncancel?: any) {
		let captured: any;
		super((c, e, p) => {
			captured = { c, e, p };
		}, oncancel ? oncancel : () => this.oncancel);
		this.completeCallback = captured.c;
		this.errorCallback = captured.e;
		this.progressCallback = captured.p;
	}

	private oncancel(): void {
		this.errorCallback(errors.canceled());
	}

	public complete(c: C) {
		this.completeCallback(c);
	}

	public progress(p: P) {
		this.progressCallback(p);
	}

	public error(e: any) {
		this.errorCallback(e);
	}
}

export function toResource(this: any, path: string) {
	return URI.file(paths.join('C:\\', Buffer.from(this.test.fullTitle()).toString('base64'), path));
}

export function suiteRepeat(n: number, description: string, callback: (this: any) => void): void {
	for (let i = 0; i < n; i++) {
		suite(`${description} (iteration ${i})`, callback);
	}
}

export function testRepeat(n: number, description: string, callback: (this: any, done: MochaDone) => any): void {
	for (let i = 0; i < n; i++) {
		test(`${description} (iteration ${i})`, callback);
	}
}
