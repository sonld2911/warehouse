import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'content',
    templateUrl  : './content.component.html',
    styleUrls    : ['./content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent
{
    Pusher = require('pusher-js');

    /**
     * Constructor
     */
    constructor()
    {
        const name = localStorage.getItem('key');
        console.log(name);

        this.notificatio(name);
    }
    notificatio (user): void {
        console.log(user);
        const pusher = new this.Pusher('32f3c61f78d9f66b2d26', { cluster: 'ap1', forceTLS: true});
        const axios = require('axios');

        // retrieve the socket ID once we're connected
        pusher.connection.bind('connected', function (): void  {
            // attach the socket ID to all outgoing Axios requests
            axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
            console.log('socketID: ', pusher.connection.socket_id);
        });
        Notification.requestPermission();
        pusher.subscribe(user)
                .bind('post_updated', function (post): void {
                    console.log(post);
                    const notification = new Notification(post.title,
                    {
                        icon: 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png',
                        body: post.body,
                    });
                    notification.onclick = function (event): void {
                        window.location.href = '/posts/' + post._id;
                        event.preventDefault();
                        notification.close();
                    };
                });
    }
}
