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

function buildUpdateByQuery (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts

  const acceptedQuerystring = [
    'analyzer',
    'analyze_wildcard',
    'default_operator',
    'df',
    'from',
    'ignore_unavailable',
    'allow_no_indices',
    'conflicts',
    'expand_wildcards',
    'lenient',
    'pipeline',
    'preference',
    'q',
    'routing',
    'scroll',
    'search_type',
    'search_timeout',
    'max_docs',
    'sort',
    '_source',
    '_source_excludes',
    '_source_exclude',
    '_source_includes',
    '_source_include',
    'terminate_after',
    'stats',
    'version',
    'version_type',
    'request_cache',
    'refresh',
    'timeout',
    'wait_for_active_shards',
    'scroll_size',
    'wait_for_completion',
    'requests_per_second',
    'slices',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    analyzeWildcard: 'analyze_wildcard',
    defaultOperator: 'default_operator',
    ignoreUnavailable: 'ignore_unavailable',
    allowNoIndices: 'allow_no_indices',
    expandWildcards: 'expand_wildcards',
    searchType: 'search_type',
    searchTimeout: 'search_timeout',
    maxDocs: 'max_docs',
    _sourceExcludes: '_source_excludes',
    _sourceExclude: '_source_exclude',
    _sourceIncludes: '_source_includes',
    _sourceInclude: '_source_include',
    terminateAfter: 'terminate_after',
    versionType: 'version_type',
    requestCache: 'request_cache',
    waitForActiveShards: 'wait_for_active_shards',
    scrollSize: 'scroll_size',
    waitForCompletion: 'wait_for_completion',
    requestsPerSecond: 'requests_per_second',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  /**
   * Perform a update_by_query request
   * Performs an update on every document in the index without changing the source,
for example to pick up a mapping change.
   * https://www.elastic.co/guide/en/elasticsearch/reference/master/docs-update-by-query.html
   */
  return function updateByQuery (params, options, callback) {
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

    // check required parameters
    if (params['index'] == null) {
      const err = new ConfigurationError('Missing required parameter: index')
      return handleError(err, callback)
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      const err = new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`)
      return handleError(err, callback)
    }

    var warnings = []
    var { method, body, index, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_update_by_query' + '/'

    // build request object
    const request = {
      method,
      path,
      body: body || '',
      querystring
    }

    options.warnings = warnings.length === 0 ? null : warnings
    return makeRequest(request, options, callback)
  }
}

module.exports = buildUpdateByQuery
