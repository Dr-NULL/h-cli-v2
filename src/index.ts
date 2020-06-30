#!/usr/bin/env node
import { Log } from './tool/log';
import { routes } from './routing';
import { Endpoint } from './tool/endpoint';

Log.title('H. cli v2')
Endpoint.router(routes)