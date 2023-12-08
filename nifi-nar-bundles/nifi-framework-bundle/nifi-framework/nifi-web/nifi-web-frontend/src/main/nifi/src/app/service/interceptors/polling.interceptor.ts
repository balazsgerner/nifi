/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NiFiState } from '../../state';
import { Store } from '@ngrx/store';
import { stopUserPolling } from '../../state/user/user.actions';
import { stopProcessGroupPolling } from '../../pages/flow-designer/state/flow/flow.actions';

@Injectable({
    providedIn: 'root'
})
export class PollingInterceptor implements HttpInterceptor {
    constructor(private store: Store<NiFiState>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                error: (error) => {
                    if (error instanceof HttpErrorResponse && error.status === 0) {
                        this.store.dispatch(stopUserPolling());
                        this.store.dispatch(stopProcessGroupPolling());
                    }
                }
            })
        );
    }
}