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

function buildMlGetTrainedModels (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts

  const acceptedQuerystring = [
    'allow_no_match',
    'include_model_definition',
    'decompress_definition',
    'from',
    'size',
    'tags',
    'for_export'
  ]

  const snakeCase = {
    allowNoMatch: 'allow_no_match',
    includeModelDefinition: 'include_model_definition',
    decompressDefinition: 'decompress_definition',
    forExport: 'for_export'
  }

  /**
   * Perform a ml.get_trained_models request
   * Retrieves configuration information for a trained inference model.
   * https://www.elastic.co/guide/en/elasticsearch/reference/current/get-inference.html
   */
  return function mlGetTrainedModels (params, options, callback) {
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
    var { method, body, modelId, model_id, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if ((model_id || modelId) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_ml' + '/' + 'inference' + '/' + encodeURIComponent(model_id || modelId) + '/'
    } else {
      if (method == null) method = 'GET'
      path = '/' + '_ml' + '/' + 'inference' + '/'
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

module.exports = buildMlGetTrainedModels
