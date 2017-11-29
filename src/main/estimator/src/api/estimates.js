import $ from 'jquery'
import { DEV_PARTS } from '../test/harness'

export default class ApiEstimates {

    static addEditEstimate(estimate) {
        return new Promise(resolve => {
            if (process.env.NODE_ENV === 'production') {
                $.ajax({
                        url: '/api/v1/estimates/',
                        type: 'POST',
                        data: JSON.stringify(estimate),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8'
                    })
                    .done(resp => {
                        resolve(estimate)
                    })
                    .fail(xhr => {
                        resolve(estimate)
                    });
            } else {
                setTimeout(() => {
                    resolve(estimate);
                }, 1000);
            }
        });
    }

    static fetchParts(selection) {
        return new Promise(resolve => {
            if (process.env.NODE_ENV === 'production') {
                $.ajax({
                    url: `/api/v1/parts/${selection.make}/${selection.model}/${selection.year}`,
                    type: 'GET',
                    dataType: 'json'
                })
                    .done(resp => {
                        resolve(resp)
                    })
                    .fail(xhr => { /* TODO */
                    });
            } else {
                setTimeout(() => {
                    resolve(DEV_PARTS);
                }, 1000);
            }
        })
    }

}
