# What is this?

This document contains information on howe to use translations in the application.

## Table of Contents

* [What is this?](#what-is-this)
   * [Table of Contents](#table-of-contents)
   * [Basic usage](#basic-usage)
      * [In template files](#in-template-files)
      * [In TypeScript code](#in-typescript-code)
   * [Advanced](#advanced)
   * [Resources](#resources)

## Basic usage

### Defining translations in the assets

Each language is stored in its own JSON file, for example `fi.json`.
In this project we are using nested (or so called namespaced-json) format. 
Below is an example on how to group translation keys correctly.

```json
{
  "auth": {
    "login": {
      "password": {
        "error": "Kirjoita salasana",
        "placeholder": "Salasana"
      },
      "submit": "Kirjaudu sisään",
      "title": "Kirjaudu sisään",
      "username": {
        "error": "Kirjoita käyttäjätunnus",
        "placeholder": "Käyttäjätunnus"
      }
    }
  },
  "common": {
    "language": {
      "en": "English",
      "fi": "Suomi",
      "pl": "Poland"
    }
  },
  ...
}
```

### In template files

Translations are easy to use with translation pipe:

```html
<div>
  <form>
    <button>{{ 'auth.login.submit' | translate }}</button>
  </form>
</div>
```

Sometimes we need to have params inside the translatable string:

```json
{
  ...: {
    "greeting": "Hei {{name}}!"
  }
}
```

Then we have to use `[translateParams]` in template:

```html
<h1 translate 
    [translateParams]="{name: 'Pekka'}"
>greeting</h1>
```

### In TypeScript code

Sometimes we have to use translatable strings straight in our code. 
Luckily, there is a way to easily maintain these strings with the `@biesbjerg/ngx-translate-extract` package.
What you need to do in the code, is to first import the marker function:

```typescript
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
``` 

And then when you need to use a string in code, wrap it with the marker function. This way we can automatically keep
track on the translation keys with the mentioned package. 
The function itself does nothing — it only passes the string as a result.

```typescript
const message = _('that_form.this_message');
```

This `message` variable can now be used as a normal translation tag in component. e.g.

```html
<p>{{ message | translate }}</p>
```

## Advanced

Manually tracking all the translatable keys in our templates and code is a pain in the $!@. 
Eventually some keys will be forgotten from some of our translation files, or some keys turn out to be redundant and
are forgotten to be deleted. 

**Fortunately** we have a tool to be used when working with translations. `@biesbjerg/ngx-translate-extract` is set
up in the project so, that it will collect all used translation keys and add them to our translation files. Also it 
sorts the JSON nicely, cleans up unused tags, and keeps the format just like we wanted. All in on command:

```bash
yarn run extract-translations
```

Neat right?

## Resources

* [Great tutorial](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular7-app-with-ngx-translate)
* [Github](https://github.com/ngx-translate/core)
* [Ngx-Translate home page](http://www.ngx-translate.com/)
