import $ from 'jquery'
import { DEV_PARTS, BLANK_PART } from '../test/harness'

export default class ApiParts {

    static getPartsList(key) {
        return new Promise(resolve => {
          if (key){
            if (process.env.NODE_ENV === 'production') {
              $.ajax(`/api/v1/parts/search/findByNameContaining?name=${key}`, {dataType: 'json'})
                .done(data => {
                  resolve(data)
                })
                .fail(xhr => { /* TODO */
                });
            } else {
              setTimeout(() => {
                resolve(DEV_PARTS);
              }, 1000);
            }
          } else {
            resolve();
          }
        });
    }

    static addEditPart(part) {
        return new Promise(resolve => {
            if (process.env.NODE_ENV === 'production') {
                $.ajax({
                        url: '/api/v1/parts/',
                        type: 'POST',
                        data: JSON.stringify(part),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8'
                    })
                    .done(resp => {
                        resolve(resp)
                    })
                    .fail(xhr => { /* TODO */
                    });
            } else {
                setTimeout(() => {
                    resolve(part);
                }, 1000);
            }
        });
    }

    static deletePart(partId) {
        return new Promise(resolve => {
            if (process.env.NODE_ENV === 'production') {
                $.ajax({url: `/api/v1/parts/${partId}`, type: 'DELETE'})
                    .done(resp => resolve(resp))
                    .fail(xhr => { /* TODO */
                    });
            } else {
                setTimeout(() => {
                    // do something here
                    resolve(partId);
                }, 500);
            }
        });
    }

    static fetchPart(partId) {
        return new Promise(resolve => {
            if (partId === -1) {
                resolve(BLANK_PART);
            } else if (process.env.NODE_ENV === 'production') {
                $.ajax({url: `/api/v1/parts/${partId}/doc`, type: 'GET'}, {dataType: 'json'})
                    .done(resp => {
                        resolve(resp)
                    })
                    .fail(xhr => { /* TODO */
                    });
            } else {
                setTimeout(() => {
                    resolve(DEV_PARTS.filter((p) => { return p._id == partId })[0]); // === breaks this
                }, 500);
            }
        });
    }

}
