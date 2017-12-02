import $ from 'jquery'
import { DEV_USER } from '../test/harness'

export default class ApiUsers {

    static login(username, password) {
        return new Promise(resolve => {
            if (process.env.NODE_ENV === 'production') {
                $.ajax({
                        url: '/api/v1/login/users',
                        type: 'POST',
                        data: JSON.stringify({ username: username, password: password }),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8'
                    })
                    .done(resp => {
                        resolve(resp)
                    })
                    .fail(xhr => {
                        resolve(undefined)
                    });
            } else {
                setTimeout(() => {
                    resolve({ username: username, password: password });
                }, 1000);
            }
        });
    }

}
