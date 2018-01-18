'use strict';

import { EventEmitter } from 'events';
import loudness from 'loudness';

export default class Volume extends EventEmitter {
    
    constructor(
        options, 
        output
    ) {
        super();
        options = options || {};
        this.output = output || {};
    }

    update() {

        var volumeMute = '<span font="Material-Design-Iconic-Font" size="large"></span>';
        var volumeLow = '<span font="Material-Design-Iconic-Font" size="large"></span>';
        var volumeMid = '<span font="Material-Design-Iconic-Font" size="large"></span>';
        var volumeHi = '<span font="Material-Design-Iconic-Font" size="large"></span>';
        var headphones = '<span font="Material-Design-Iconic-Font" size="large"></span>'; 

        this.emit('pause', this);

        loudness.getMuted((err, mute) => {
            // mute = false

            if ( mute ) {
                
                this.output.full_text = volumeMute;
                this.output.short_text = volumeMute;


                this.emit('resume', this);
                this.emit('updated', this, this.output);

                return false;
            }

            loudness.getVolume((err, vol) => {
                // Done
                var output = "";

                switch(true) {
                    case (vol >= 80):
                        output = volumeHi;
                    break;
                    case (vol < 80 && vol > 20):
                        output = volumeMid;
                    break;
                    case (vol <= 20):
                        output = volumeLow;
                    break;
                }

                this.output.full_text = output;
                this.output.short_text = output;

                this.emit('resume', this);
                this.emit('updated', this, this.output);

            });
        });
    }

    action(action) {
        if (this.__reporter && this.__reporter.supports('html')) {
            var output = {
                header: 'Starter sample',
                content: `<h1>Hello World!</h1><p>Secret value is ${this.secretValue}`,
                userStyle: 'h1 { color: red }'
            };
            this.__reporter.display(output, action);
        }
    }

}