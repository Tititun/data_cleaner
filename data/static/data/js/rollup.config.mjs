import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace';



export default {
        input : 'App.js',
        output: {
            file : 'bundle.js',
            format: 'iife'
        },
        plugins: [resolve(),
                  babel.babel({
                     exclude: 'node_modules/**',
                     presets: ['@babel/env', '@babel/preset-react']
                   }),
                  commonjs({
                     namedExports: {
                        react: ['createElement', 'PureComponent'],
                     }
                    }),
                replace({
                        'process.env.NODE_ENV': JSON.stringify( 'production' )
                      })
            ]
        };