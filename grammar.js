const CPP = require('tree-sitter-cpp/grammar');

module.exports = grammar(CPP, {
    name: 'metal',

    rules: {
        storage_class_specifier: ($, original) => choice(
            original,
            'device',
            'constant',
            'thread',
            'threadgroup',
            'threadgroup_imageblock',
            'ray_data',
            'object_data',
            'kernel',
            'vertex',
            'fragment'
        ),

        primitive_type: _ => token(choice(
            'bool',
            'char',
            'uchar',
            'short',
            'ushort',
            'int',
            'uint',
            'long',
            'half',
            'bfloat',
            'float',
            'size_t',
            'ptrdiff_t',
            'void',
            ...[8, 16, 32, 64].map(n => `int${n}_t`),
            ...[8, 16, 32, 64].map(n => `uint${n}_t`),
            ...[2, 3, 4].map(n => `bool${n}`),
            ...[2, 3, 4].map(n => `char${n}`),
            ...[2, 3, 4].map(n => `uchar${n}`),
            ...[2, 3, 4].map(n => `short${n}`),
            ...[2, 3, 4].map(n => `ushort${n}`),
            ...[2, 3, 4].map(n => `int${n}`),
            ...[2, 3, 4].map(n => `uint${n}`),
            ...[2, 3, 4].map(n => `long${n}`),
            ...[2, 3, 4].map(n => `ulong${n}`),
            ...[2, 3, 4].map(n => `half${n}`),
            ...[2, 3, 4].map(n => `bfloat${n}`),
            ...[2, 3, 4].map(n => `float${n}`),

            ...[2, 3, 4].map(n => `packed_bool${n}`),
            ...[2, 3, 4].map(n => `packed_char${n}`),
            ...[2, 3, 4].map(n => `packed_uchar${n}`),
            ...[2, 3, 4].map(n => `packed_short${n}`),
            ...[2, 3, 4].map(n => `packed_ushort${n}`),
            ...[2, 3, 4].map(n => `packed_int${n}`),
            ...[2, 3, 4].map(n => `packed_uint${n}`),
            ...[2, 3, 4].map(n => `packed_long${n}`),
            ...[2, 3, 4].map(n => `packed_ulong${n}`),
            ...[2, 3, 4].map(n => `packed_half${n}`),
            ...[2, 3, 4].map(n => `packed_bfloat${n}`),
            ...[2, 3, 4].map(n => `packed_float${n}`),

            ...[2, 3, 4].map(n => `half{n}x2`),
            ...[2, 3, 4].map(n => `half{n}x3`),
            ...[2, 3, 4].map(n => `half{n}x4`),
            ...[2, 3, 4].map(n => `float{n}x2`),
            ...[2, 3, 4].map(n => `float{n}x3`),
            ...[2, 3, 4].map(n => `float{n}x4`),
            'simdgroup_half8x8',
            'simdgroup_bfloat8x8',
            'simdgroup_float8x8'
        )),

        number_literal: $ => {
            const sign = /[-\+]/;
            const separator = '\'';
            const binary = /[01]/;
            const binaryDigits = seq(repeat1(binary), repeat(seq(separator, repeat1(binary))));
            const decimal = /[0-9]/;
            const firstDecimal = /[1-9]/;
            const intDecimalDigits = seq(firstDecimal, repeat(decimal), repeat(seq(separator, repeat1(decimal))));
            const floatDecimalDigits = seq(repeat1(decimal), repeat(seq(separator, repeat1(decimal))));
            const hex = /[0-9a-fA-F]/;
            const hexDigits = seq(repeat1(hex), repeat(seq(separator, repeat1(hex))));
            const octal = /[0-7]/;
            const octalDigits = seq('0', repeat(octal), repeat(seq(separator, repeat1(octal))));
            const hexExponent = seq(/[pP]/, optional(sign), floatDecimalDigits);
            const decimalExponent = seq(/[eE]/, optional(sign), floatDecimalDigits);
            const intSuffix = /(ll|LL)[uU]?|[uU](ll|LL)?|[uU][lL]?|[uU][zZ]?|[lL][uU]?|[zZ][uU]?/;
            const floatSuffix = /([fF]|[hH]|(bf|BF))?/;

            return token(seq(
                optional(sign),
                choice(
                    seq(
                        choice(
                            seq(choice('0b', '0B'), binaryDigits),
                            intDecimalDigits,
                            seq(choice('0x', '0X'), hexDigits),
                            octalDigits,
                        ),
                        optional(intSuffix),
                    ),
                    seq(
                        choice(
                            seq(floatDecimalDigits, decimalExponent),
                            seq(floatDecimalDigits, '.', optional(floatDecimalDigits), optional(decimalExponent)),
                            seq('.', floatDecimalDigits, optional(decimalExponent)),
                            seq(
                                choice('0x', '0X'),
                                choice(
                                    hexDigits,
                                    seq(hexDigits, '.', optional(hexDigits)),
                                    seq('.', hexDigits)),
                                hexExponent,
                            ),
                        ),
                        optional(floatSuffix),
                    ),
                ),
            ));
        }
    }
});
