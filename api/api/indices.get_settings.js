/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildIndicesGetSettings (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts

  const acceptedQuerystring = [
    'master_timeout',
    'ignore_unavailable',
    'allow_no_indices',
    'expand_wildcards',
    'flat_settings',
    'local',
    'include_defaults',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    masterTimeout: 'master_timeout',
    ignoreUnavailable: 'ignore_unavailable',
    allowNoIndices: 'allow_no_indices',
    expandWildcards: 'expand_wildcards',
    flatSettings: 'flat_settings',
    includeDefaults: 'include_defaults',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  /**
   * Perform a indices.get_settings request
   * Returns settings for one or more indices.
   * https://www.elastic.co/guide/en/elasticsearch/reference/master/indices-get-settings.html
   */
  return function indicesGetSettings (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (typeof params === 'function' || params == null) {
      callback = params
      params = {}
      options = {}
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      const err = new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`)
      return handleError(err, callback)
    }

    var warnings = []
    var { method, body, index, name, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if ((index) != null && (name) != null) {
      if (method == null) method = 'GET'
      path = '/' + encodeURIComponent(index) + '/' + '_settings' + '/' + encodeURIComponent(name) + '/'
    } else if ((index) != null) {
      if (method == null) method = 'GET'
      path = '/' + encodeURIComponent(index) + '/' + '_settings' + '/'
    } else if ((name) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_settings' + '/' + encodeURIComponent(name) + '/'
    } else {
      if (method == null) method = 'GET'
      path = '/' + '_settings' + '/'
    }

    // build request object
    const request = {
      method,
      path,
      body: null,
      querystring
    }

    options.warnings = warnings.length === 0 ? null : warnings
    return makeRequest(request, options, callback)
  }
}

module.exports = buildIndicesGetSettings
