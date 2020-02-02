const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const server = express();

let currentLng = 'Pl';

server.use(cookieParser());

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 204
};

server.options('/Language', cors(corsOptions))
server.get('/Language', cors(corsOptions), (req, res) => {
    console.log('request to /Language')
    const cookie = req.cookies.auth;
    const payLoad = {
        currentLanguage: currentLng,
        languageOptionsList: [
            {
                id: 1,
                iso: 'Pl'
            },
            {
                id: 2,
                iso: 'En'
            }
        ]
    };

    if (!cookie) {
        console.log('No cookie found');
        res.cookie('auth', 1234, { maxAge: 900000, httpOnly: true });
        res.json({ payLoad: payLoad, error: null });
        console.log(`Cookie auth: 1234 created`);
    } else {
        console.log(`Auth cookie found: ${cookie}`);
        res.json({
            payLoad: payLoad,
            error: null
        });
    };
});

server.options('/Language/:id', cors(corsOptions))
server.post('/Language/:id', cors(corsOptions), (req, res) => {
    console.log('request to /Language/:id')
    const id = req.params.id;
    const cookie = req.cookies.auth;
    console.log('test');
    console.log(typeof id);
    console.log(id === '2');

    if (id !== '2') {
        res.json({ payLoad: null, error: `id ${id} not found`});
    } else {
        console.log('cookie');
        console.log(cookie);
        if (!cookie || cookie !== '1234') {
            console.log('no cookie or bad cookie, not performing change');
        } else {
            const update = id === 1 ? 'Pl' : 'En';
            console.log(`cookie, found changing currentLng to ${update}`)
            currentLng = update;
        }
        res.json({ payLoad: null, error: null, statusCode: 200 });
    }
});

server.options('/InitProps', cors(corsOptions))
server.get('/InitProps', cors(corsOptions), (req, res) => {
    console.log('request to /InitProps')
    const payLoad = {
        navbar: {
            logo: {
                Source: '/placeholder.com-logo1.png',
                AlternativeText: 'alt text'
            },
            navigation: {
                menuPositions: [
                    {
                        type: 'Url',
                        label: currentLng === 'Pl' ? '[PL] Strona 1' : '[EN] Page 1',
                        url: {
                            href: '/strona1'
                        }
                    },
                    {
                        type: 'Url',
                        label: currentLng === 'Pl' ? '[PL] Strona 2' : '[EN] Page 2',
                        url: {
                            href: '/strona2'
                        },
                        subMenu: [
                            {
                                label: currentLng === 'Pl' ? '[PL] Podstrona 1' : '[EN] Subpage 1',
                                url: {
                                    href: '/podstrona1'
                                }
                            },
                            {
                                label: currentLng === 'Pl' ? '[PL] Podstrona 2' : '[EN] Subpage 2',
                                url: {
                                    href: '/podstrona2'
                                }
                            },
                        ]
                    },
                    {
                        type: 'Url',
                        label: currentLng === 'Pl' ? '[PL] Strona 1' : '[EN] Page 1',
                        url: {
                            href: '/strona1'
                        }
                    },
                ],
                shortenedNames: false,
            },
            controls: {
                hamburgerAnimation: 'squeeze',
                shoppingCart: {
                    itemsCount: 2
                },
                favourites: {
                    itemsCount: 1
                },
            },
            mobileMenu: {
                navigation: {
                    label: 'NAV'
                },
                categoryTree: {
                    label: 'CAT'
                },
                filters: {
                    label: 'FLT'
                },
            }
        }
    };
    res.json({
        payLoad: payLoad,
        error: null
    });
});

server.listen(3001, () => {
    console.log('Test APi server running at 3001');
});