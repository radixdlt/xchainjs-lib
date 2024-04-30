import { StateEntityDetailsResponse, TransactionCommittedDetailsResponse } from '@radixdlt/babylon-gateway-api-sdk'

export const mockEntityDetailsResponse: StateEntityDetailsResponse = {
  ledger_state: {
    network: 'mainnet',
    state_version: 73418426,
    proposer_round_timestamp: '2024-04-19T18:16:22.687Z',
    epoch: 91334,
    round: 86,
  },
  items: [
    {
      address: 'account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w',
      fungible_resources: {
        total_count: 28,
        items: [
          {
            amount: '444.212927889954956487',
            last_updated_at_state_version: 73022080,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
          },
          {
            amount: '0.000000109468214492',
            last_updated_at_state_version: 39686136,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1th2hexq3yrz8sj0nn3033gajnj7ztl0erp4nn9mcl5rj9au75tum0u',
          },
          {
            amount: '2367.538644471972121542',
            last_updated_at_state_version: 39406565,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thksg5ng70g9mmy9ne7wz0sc7auzrrwy7fmgcxzel2gvp8pj0xxfmf',
          },
          {
            amount: '0.000000000000051492',
            last_updated_at_state_version: 39406565,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1tk9xrt4jxsavkmqp8e4xc9u2vwk3n672n4jzmvxrrujhts5sr4e67q',
          },
          {
            amount: '1131.191721666815934647',
            last_updated_at_state_version: 36560157,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1tkk83magp3gjyxrpskfsqwkg4g949rmcjee4tu2xmw93ltw2cz94sq',
          },
          {
            amount: '14981.654110658061435855',
            last_updated_at_state_version: 36536616,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t554n6l00f208regjt9xj2av0en8pueqyjldqd2u6tdvtrclrs4ev3',
          },
          {
            amount: '17229.4056806375759515',
            last_updated_at_state_version: 36536616,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t480axsxfrps66t3cw89mtusmssgrnf2y22q6vw709ez4cupc9sjdv',
          },
          {
            amount: '0',
            last_updated_at_state_version: 35971242,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t5n6agexw646tgu3lkr8n0nvt69z00384mhrlfuxz75wprtg9wwllq',
          },
          {
            amount: '0',
            last_updated_at_state_version: 35971242,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1tkjwu04wu5efa4z0zvg060yw9pga62z8n7mz40nx7vulrtvtnaf687',
          },
          {
            amount: '30',
            last_updated_at_state_version: 35971242,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t4xkx270sg2hs397dzetux64c3q0gzpa2kjepetrf6mqkz3k35hm9j',
          },
          {
            amount: '100',
            last_updated_at_state_version: 35971242,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thn6xa5vjdh5zagqzvxkxpd70r6eadpzmzr83m20ayp3yhxrjavxz5',
          },
          {
            amount: '10045.504285284042544108',
            last_updated_at_state_version: 35665278,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t4qs620v3r9uzs6744eas47vdxnf39407hhh82c09cvvj2sqz8h4h5',
          },
          {
            amount: '1',
            last_updated_at_state_version: 28853986,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t4vg8t8lgrnc2dljh4xgmhj3v6rpq7ph2f9u7ve7k6nw48xfvg5xmy',
          },
          {
            amount: '0.066197483157830618',
            last_updated_at_state_version: 28822614,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t4p39fd9n7zr7jpzljdha25axxlhcmtwqwt2a0j2tn9hkrjrn0yfwa',
          },
          {
            amount: '217.998933387078304076',
            last_updated_at_state_version: 28794316,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t5muwkqqthsv2w25syfmeef3yul6qc7vs0phulms2hyazf9p863zpq',
          },
          {
            amount: '0',
            last_updated_at_state_version: 23597617,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thdd8kqdcg0vyqh77dpyksuxsan5y9ry2u9d00pewx6mkeug7r92qz',
          },
          {
            amount: '35',
            last_updated_at_state_version: 21327218,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t5tsyyh82jxjrg7lrat7y5f7mcuxcch6d3jkc75l8et3n2n6h32kvd',
          },
          {
            amount: '10',
            last_updated_at_state_version: 21327218,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thlnv2lydu7np9w8guguqslkydv000d7ydn7uq0sestql96hrfml0v',
          },
          {
            amount: '2346',
            last_updated_at_state_version: 21326355,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t4dy69k6s0gv040xa64cyadyefwtett62ng6xfdnljyydnml7t6g3j',
          },
          {
            amount: '11059.089986398643523302',
            last_updated_at_state_version: 20937160,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1th3adk93ale3n8nzrypghtkasczmpt42qamq7x5dy8lsu3uwycvh4n',
          },
          {
            amount: '599',
            last_updated_at_state_version: 516,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1tkmh5qa5vgluvxwxyxjkjv9vgaln64t8v0j3vzz9rsf4u69rt2ljv7',
          },
          {
            amount: '119.54203569797823488',
            last_updated_at_state_version: 497,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t5g0w9fhz344t5ywqrcy59p3cyhqgwc9atxhm78jle08nrhrr24cc2',
          },
          {
            amount: '2506183.550227893234696192',
            last_updated_at_state_version: 404,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t4qfgjm35dkwdrpzl3d8pc053uw9v4pj5wfek0ffuzsp73evye6wu6',
          },
          {
            amount: '101000',
            last_updated_at_state_version: 351,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thunnyrarlduxy0x4j7sedzfvj0cxjf8cgnfcl7xn756txy7xcdqkl',
          },
          {
            amount: '10000',
            last_updated_at_state_version: 225,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thj4t8073p2jkytk3fcr2mc39ehnecq4f9cuknakpy2zyaz63v6mdt',
          },
          {
            amount: '1',
            last_updated_at_state_version: 128,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1t5a4c33dsr72l9h5v2hspa2ye9jzmptjkzky42s8ay6nfr67rvj4lv',
          },
          {
            amount: '1002022',
            last_updated_at_state_version: 104,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1th8zw0meumt5t60hdaak8xmc5talrpmphjj2htjutsen02pty9zsd9',
          },
          {
            amount: '7168.904729368610817137',
            last_updated_at_state_version: 8,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1thtyxvkkn96dyauuws5f78f6yevh2955decu24p3wtxgcurvjflec3',
          },
        ],
      },
      non_fungible_resources: {
        total_count: 11,
        items: [
          {
            amount: 1,
            last_updated_at_state_version: 71506994,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1ntvmy08hnz5ye090yug4fznnewnjdaptnl0d97uygusgvpzx9hyxk4',
          },
          {
            amount: 0,
            last_updated_at_state_version: 64277239,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1nfuf2z370tt7nr6gpjje60tq9zdksj0lgwmpcfdchkscnha0422dfp',
          },
          {
            amount: 0,
            last_updated_at_state_version: 61159030,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1nt7uscrcl2dxtugxzl5wws92fwm2rl2g7e4v66ane49kkn7xdmpftz',
          },
          {
            amount: 0,
            last_updated_at_state_version: 50831336,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1ntyg43hlwegw6q9f4v074ruxvke3keykfnew4kmnu57k9dawu94t8l',
          },
          {
            amount: 0,
            last_updated_at_state_version: 39404310,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1ngpnrpyhl0hspjdrwsjmlhr6tgrkw7sqq9edrs5jcewxg5n3h2ukg4',
          },
          {
            amount: 0,
            last_updated_at_state_version: 37701899,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1ntrysy2sncpj6t6shjlgsfr55dns9290e2zsy67fwwrp6mywsrrgsc',
          },
          {
            amount: 0,
            last_updated_at_state_version: 36560157,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1ntfanvrnhntxdvc9skrepp2pvdvve00607ws7senfkys0pyxr7a8lt',
          },
          {
            amount: 0,
            last_updated_at_state_version: 35968945,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1nfzpyryg5x5x3586dgcka44884f99rjcrusvwgkkc3jatzuwk6tflp',
          },
          {
            amount: 0,
            last_updated_at_state_version: 35968818,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1ng59sgyq5uu3nlmstnkuavqvsjzg7f8hrlst4hreymydxpx9csxt40',
          },
          {
            amount: 1,
            last_updated_at_state_version: 23594970,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1nt3frmqu4v57dy55e90n0k3uy352zyy89vszzamvjld6vqvr98rls9',
          },
          {
            amount: 1,
            last_updated_at_state_version: 20938459,
            aggregation_level: 'Global',
            resource_address: 'resource_rdx1nfyg2f68jw7hfdlg5hzvd8ylsa7e0kjl68t5t62v3ttamtejc9wlxa',
          },
        ],
      },
      metadata: {
        total_count: 2,
        items: [
          {
            key: 'owner_keys',
            value: {
              raw_hex: '5c228f01202201000120071dabe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d',
              programmatic_json: {
                variant_id: 143,
                fields: [
                  {
                    element_kind: 'Enum',
                    elements: [
                      {
                        variant_id: 0,
                        fields: [
                          {
                            element_kind: 'U8',
                            hex: 'abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d',
                            kind: 'Bytes',
                          },
                        ],
                        kind: 'Enum',
                      },
                    ],
                    kind: 'Array',
                  },
                ],
                kind: 'Enum',
              },
              typed: {
                values: [
                  {
                    hash_hex: 'abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d',
                    key_hash_type: 'EcdsaSecp256k1',
                  },
                ],
                type: 'PublicKeyHashArray',
              },
            },
            is_locked: false,
            last_updated_at_state_version: 8,
          },
          {
            key: 'owner_badge',
            value: {
              raw_hex: '5c220b01c0021ed1abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d',
              programmatic_json: {
                variant_id: 11,
                fields: [
                  {
                    value: '[d1abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d]',
                    kind: 'NonFungibleLocalId',
                  },
                ],
                kind: 'Enum',
              },
              typed: {
                value: '[d1abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d]',
                type: 'NonFungibleLocalId',
              },
            },
            is_locked: true,
            last_updated_at_state_version: 8,
          },
        ],
      },
      details: {
        package_address: 'package_rdx1pkgxxxxxxxxxaccntxxxxxxxxxx000929625493xxxxxxxxxaccntx',
        blueprint_name: 'Account',
        blueprint_version: '1.0.0',
        state: {
          default_deposit_rule: 'Accept',
        },
        role_assignments: {
          owner: {
            rule: {
              type: 'Protected',
              access_rule: {
                type: 'ProofRule',
                proof_rule: {
                  type: 'Require',
                  requirement: {
                    type: 'NonFungible',
                    non_fungible: {
                      local_id: {
                        id_type: 'Bytes',
                        sbor_hex: '5cc0021dabe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d',
                        simple_rep: '[abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d]',
                      },
                      resource_address: 'resource_rdx1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxsecpsg',
                    },
                  },
                },
              },
            },
            updater: 'Object',
          },
          entries: [
            {
              role_key: {
                module: 'Main',
                name: 'securify',
              },
              assignment: {
                resolution: 'Explicit',
                explicit_rule: {
                  type: 'Protected',
                  access_rule: {
                    type: 'ProofRule',
                    proof_rule: {
                      type: 'Require',
                      requirement: {
                        type: 'NonFungible',
                        non_fungible: {
                          local_id: {
                            id_type: 'Bytes',
                            sbor_hex: '5cc0021dabe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d',
                            simple_rep: '[abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d]',
                          },
                          resource_address: 'resource_rdx1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxsecpsg',
                        },
                      },
                    },
                  },
                },
              },
              updater_roles: [
                {
                  module: 'Main',
                  name: '_self_',
                },
              ],
            },
            {
              role_key: {
                module: 'Metadata',
                name: 'metadata_locker',
              },
              assignment: {
                resolution: 'Owner',
              },
              updater_roles: [
                {
                  module: 'Metadata',
                  name: 'metadata_locker_updater',
                },
              ],
            },
            {
              role_key: {
                module: 'Metadata',
                name: 'metadata_locker_updater',
              },
              assignment: {
                resolution: 'Owner',
              },
              updater_roles: [
                {
                  module: 'Metadata',
                  name: 'metadata_locker_updater',
                },
              ],
            },
            {
              role_key: {
                module: 'Metadata',
                name: 'metadata_setter',
              },
              assignment: {
                resolution: 'Owner',
              },
              updater_roles: [
                {
                  module: 'Metadata',
                  name: 'metadata_setter_updater',
                },
              ],
            },
            {
              role_key: {
                module: 'Metadata',
                name: 'metadata_setter_updater',
              },
              assignment: {
                resolution: 'Owner',
              },
              updater_roles: [
                {
                  module: 'Metadata',
                  name: 'metadata_setter_updater',
                },
              ],
            },
          ],
        },
        type: 'Component',
      },
    },
  ],
}

export const mockCommittedDetailsResponse: TransactionCommittedDetailsResponse = {
  ledger_state: {
    network: 'mainnet',
    state_version: 73378251,
    proposer_round_timestamp: '2024-04-19T15:54:47.591Z',
    epoch: 91305,
    round: 1071,
  },
  transaction: {
    transaction_status: 'CommittedSuccess',
    state_version: 73022080,
    epoch: 91055,
    round: 1145,
    round_timestamp: '2024-04-18T19:05:01.117Z',
    payload_hash: 'notarizedtransaction_rdx1h92j298aw35ty5ph65qj9kwswva9njvsq8796u93pgwsy35edzzsqk538t',
    intent_hash: 'txid_rdx195z9zjp43qvqk8fnzmnpazv5m7jsaepq6cnm5nnnn5p3m2573rvqamjaa8',
    fee_paid: '0.24701070443',
    confirmed_at: new Date('2024-04-18T19:05:01.117Z'),
    raw_hex:
      '4d2202022104210707010a88130000000000000a8a13000000000000093695d9e42201012007205c180935949806e6c7532e63d8cc75be10cb1e56a40e23d193fc4a9e8ee9eba6010108000020220441038000d148b7923acafac9ccc1ab794cda7e000ebbf3f0f51e0d2460a19c7424140c086c6f636b5f6665652101850000f444829163450000000000000000000000000000000041038000d148b7923acafac9ccc1ab794cda7e000ebbf3f0f51e0d2460a19c7424140c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c68500c025b0023ae64001000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c68500c025b0023ae6400100000000000000000000000000000041038000d1abe47040ad7fb0fd0f25933567eb72e8e7649f0f38182e069a767fa19d0c147472795f6465706f7369745f6f725f61626f727421028100000000220000202000220000202200',
    receipt: {
      status: 'CommittedSuccess',
    },
    manifest_classes: ['Transfer', 'General'],
  },
}

export const mockConstructionMetadataResponse = {
  ledger_state: {
    network: 'mainnet',
    state_version: 73433937,
    proposer_round_timestamp: '2024-04-19T19:12:29.607Z',
    epoch: 92167,
    round: 405,
  },
}

export const mockTransactionPreviewResponse = {
  encoded_receipt:
    '5c22000121062108a000743ba40b000000000000000000000000000000000000000900e1f5050900093d00a000743ba40b000000000000000000000000000000000000000980f0fa02a0aaaa829007e54be700000000000000000000000000000000a080cdc975bc56000000000000000000000000000000000000a080cdc975bc560000000000000000000000000000000000002102080a00a0000000a1edccce1bc2d30000000000000000000000000000210709567808000900000000a000f858aac09a620000000000000000000000000000000000a0000000000000000000000000000000000000000000000000a0004c6f7746dc090000000000000000000000000000000000a0000a8dd7bebf800000000000000000000000000000000000a00000000000000000000000000000000000000000000000002201012102230c090a0e416c6c6f636174654e6f64654964230100000d436c6f736553756273746174658f0700000a4372656174654e6f64653c0900001b4f70656e53756273746174653a3a476c6f62616c5061636b616765e8590400294f70656e53756273746174653a3a476c6f62616c5669727475616c456432353531394163636f756e743ab50300264f70656e53756273746174653a3a496e7465726e616c47656e65726963436f6d706f6e656e74460400000750696e4e6f6465240000000c5265616453756273746174657c1700001156616c696461746554785061796c6f6164603b00001256657269667954785369676e61747572657300000000230c09002200012109210123202206071e860c6318c6318c6c4e1b40cc6318c6318cf7bca52eb54a6a86318c6318c60001230722014000012322220100010702000120077c5c220001210222000121022307a0035ee0857750734185010000000000000000000000000000000019a0dcb25c1997d501000000000000000000000000000000000e80cce857e6b24200000000000000000000000000000000009058619833de031de3aad69cad02a22656e083e307fb617b28e1b275bd7ed7220000071e82cc6318c6318c659963ed8c6318c6318cf7e8f5ae8f4a96a6318c6318c6000123072202400001232222010001070000012007265c220001210222000121050ab564010000000000074e074107ff0a64000000000000002200004e00012322220101012007245c20072099170359ed90a3eed14a4eb945c0bfaf88bbb961da4165133e9d6ff0b118846700012007125c2200012102220101220001220100220000071e0d906318c6318c659a6130cc6318c6318cf7a8ba5295eabf46318c6318c6000123072206440001232222004200012322220041000123222200010001232222004500012322220046000123222200071e5178a34db0630a4a2895fa5c5b6513808884f2144f6e523f26ebbb76d8f1000123072203000001232222000600012322220005000123222200071e0d906318c6318c6ee313598c6318c6318cf7bcaa2e954a9626318c6318c600012307220144000123222200071e58619833de031de3aad69cad02a22656e083e307fb617b28e1b275bd7ed7000123072201400001232222010001070000012007255c2200012102220001a04dd09fcb0f38250700000000000000000000000000000000220000210520800020800020800020800023202101071e58619833de031de3aad69cad02a22656e083e307fb617b28e1b275bd7ed702805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6220001a0004d623886897b000000000000000000000000000000000021012320a0002104a080cce857e6b2420000000000000000000000000000000000a0808079e09fd6380000000000000000000000000000000000a00001f3c03fad7100000000000000000000000000000000002322a0002201012202012200012203012102220001202101020c075f6f776e65725f20220102012200012200012200012102809a4c6318c6318c6cb554820c6318c6318cf7a951d7a9e547c6318c6318c6c0021d78a34db0630a4a2895fa5c5b6513808884f2144f6e523f26ebbb76d8f121022102800d906318c6318c6ee313598c6318c6318cf7bcaa2e954a9626318c6318c60c074163636f756e740c086c6f636b5f66656520210202210222010220071e58619833de031de3aad69cad02a22656e083e307fb617b28e1b275bd7ed72200000c0c4465706f7369744576656e7420071c5c2101a0004d623886897b000000000000000000000000000000000002210222010220071e5da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c62200000c194275726e46756e6769626c655265736f757263654576656e7420071c5c2101a00001f3c03fad710000000000000000000000000000000000202100210223202303071e860c6318c6318c6c4e1b40cc6318c6318cf7bca52eb54a6a86318c6318c607230140222201000107020301210122000121012103800d906318c6318c6c4e1b40cc6318c6318cf7bfd5d45f48c686318c6318c6200720d8510877df1d820f4752b3c033baf656f62e0e612731718865d048b9d16300b32201010a0900000000000000071e82cc6318c6318c659963ed8c6318c6318cf7e8f5ae8f4a96a6318c6318c607230240222201000107000301210122000121012103800d906318c6318c659963ed8c6318c6318cf7be85a17d48bca6318c6318c6200720bd71c021e525c608eaf7291c8c0eb2519993241a8e8d6d58c62e3ae0565355922201010a03000000000000004e22220101012007245c20072099170359ed90a3eed14a4eb945c0bfaf88bbb961da4165133e9d6ff0b11884670401210222000121012103800d906318c6318c659963ed8c6318c6318cf7be85a17d48bca6318c6318c6200720bd71c021e525c608eaf7291c8c0eb2519993241a8e8d6d58c62e3ae0565355922201010a000000000000000022000121012103800d906318c6318c659963ed8c6318c6318cf7be85a17d48bca6318c6318c6200720bd71c021e525c608eaf7291c8c0eb2519993241a8e8d6d58c62e3ae0565355922201010a0100000000000000071e58619833de031de3aad69cad02a22656e083e307fb617b28e1b275bd7ed707230140222201000107000301210122000121012103800d906318c6318c61e603c64c6318c6318cf7be913d63aafbc6318c6318c6200720462a3fea283117aab2b01c297812bdc0fa9060b29eb5e68b847f361bc12019332201010a0000000000000000232121020222010220071e58619833de031de3aad69cad02a22656e083e307fb617b28e1b275bd7ed72200000c0c4465706f7369744576656e740121012103800d906318c6318c61e603c64c6318c6318cf7be913d63aafbc6318c6318c6200720462a3fea283117aab2b01c297812bdc0fa9060b29eb5e68b847f361bc12019332201010a19000000000000000222010220071e5da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c62200000c194275726e46756e6769626c655265736f757263654576656e740121012103800d906318c6318c61e603c64c6318c6318cf7be913d63aafbc6318c6318c6200720ba27cc155884d6e1aa7a41346fd8c11f18cc99775653caef1fd3455d625fd1472201010a3a000000000000002201012103202100230a20002102a0000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000220000',
  receipt: {
    status: 'Failed',
    fee_summary: {
      execution_cost_units_consumed: 555094,
      finalization_cost_units_consumed: 0,
      xrd_total_execution_cost: '0.0277547',
      xrd_total_finalization_cost: '0',
      xrd_total_royalty_cost: '0',
      xrd_total_storage_cost: '0.0362396234',
      xrd_total_tipping_cost: '0.00277547',
    },
    costing_parameters: {
      execution_cost_unit_price: '0.00000005',
      execution_cost_unit_limit: 100000000,
      execution_cost_unit_loan: 4000000,
      finalization_cost_unit_price: '0.00000005',
      finalization_cost_unit_limit: 50000000,
      xrd_usd_price: '16.666666666666666666',
      xrd_storage_price: '0.00009536743',
      xrd_archive_storage_price: '0.00009536743',
      tip_percentage: 10,
    },
    fee_source: {
      from_vaults: [],
    },
    fee_destination: {
      to_proposer: '0.01877405085',
      to_validator_set: '0.01599858085',
      to_burn: '0.0319971617',
      to_royalty_recipients: [],
    },
    state_updates: {},
    events: [],
  },
  resource_changes: [],
  logs: [],
}

export const mockStreamTransactionsResponse = {
  items: [
    {
      transaction_status: 'CommittedSuccess',
      state_version: 74063493,
      epoch: 91839,
      round: 399,
      round_timestamp: '2024-04-21T12:22:23.287Z',
      payload_hash: 'notarizedtransaction_rdx1qzhzfcxpa24ctrm5m0u4jz497xgx99dvg3pq3epp65avmyses96sn6ngnl',
      intent_hash: 'txid_rdx130ph7c6yh3tj490m2wa80c4pc0pwu4uqng2939n4s5djwfnrv82s9lxdl5',
      fee_paid: '0.24701070443',
      confirmed_at: '2024-04-21T12:22:23.287Z',
      raw_hex:
        '4d22030221022104210707010abf660100000000000ac16601000000000009cfc5f1b7220001200721026805ad5730038d04038581fed06b922983767f96245d3243fbd231768d7c147b010108000020220441038000d1ce0e025788005689381fe27c5e661388df6c8a768c51eeac11591ad8ac0c086c6f636b5f666565210185000064a7b3b6e00d0000000000000000000000000000000041038000d1ce0e025788005689381fe27c5e661388df6c8a768c51eeac11591ad8ac0c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6858018674c568df8ec35000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6858018674c568df8ec3500000000000000000000000000000041038000d1aa50c20c34dbc1789d7bf60f201e3c71140a9054478c76bae7a4d957300c147472795f6465706f7369745f6f725f61626f727421028100000000220000202000220000202200220001210120074101465049ed291ca6d49b25fb23df45797e290a6414ff6ef1b50d5b50fde75ac31b50751b5b0b207bb1d662905411827f1ae7aee2b8bfbd73c980e0e94ec41ac548',
      receipt: { status: 'CommittedSuccess' },
      manifest_classes: ['Transfer', 'General'],
    },
    {
      transaction_status: 'CommittedSuccess',
      state_version: 74050862,
      epoch: 91830,
      round: 1288,
      round_timestamp: '2024-04-21T11:40:15.33Z',
      payload_hash: 'notarizedtransaction_rdx1mcs24datkgzzwr8klzdknufynw4cnlgkuk40hy90gaz2kjpn29msr9ejmg',
      intent_hash: 'txid_rdx184a2q0r62f4p0gccxrmr5l7dgxrxhzclktkkyqvc4vgm09vv4c6s846z43',
      fee_paid: '0.24701070443',
      confirmed_at: '2024-04-21T11:40:15.33Z',
      raw_hex:
        '4d22030221022104210707010ab6660100000000000ab86601000000000009d5cbd63922000120072103f3f44c9e80e2cedc1a2909631a3adea8866ee32187f74d0912387359b0ff36a2010108000020220441038000d128c72bfd5e093f5d5fcf250c3d7754b930a0d3ea4cfe8077c8ea47783b0c086c6f636b5f6665652101850000b2d3595bf0060000000000000000000000000000000041038000d128c72bfd5e093f5d5fcf250c3d7754b930a0d3ea4cfe8077c8ea47783b0c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000ec0a63eedb56bb000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000ec0a63eedb56bb00000000000000000000000000000041038000d1c243a3cdd773bba9e79fd30c0a18dfcc993f12a680e9d1e71d64b026230c147472795f6465706f7369745f6f725f61626f7274210281000000002200002020002200002022002200012101200741017267e82ba51eb1a322b0c465f0e68a99dabab2e95cf4e311f1a729422f23ad873499f7d1cef2290cfb1254cfd833a1a7f18c1849c4079e080ad7bb341af3b052',
      receipt: { status: 'CommittedSuccess' },
      manifest_classes: ['Transfer', 'General'],
    },
    {
      transaction_status: 'CommittedSuccess',
      state_version: 74053117,
      epoch: 91832,
      round: 519,
      round_timestamp: '2024-04-21T11:47:52.86Z',
      payload_hash: 'notarizedtransaction_rdx16jeqrkwtv6ud3y304s7hfh3l8uurs4fytc4dhmfqjp0xhhvs3kaq5wqlec',
      intent_hash: 'txid_rdx1h560eswverreymruspk4gdrvg9c6r9wf02aj27w8pm0cqqcana6q2h7ee4',
      fee_paid: '0.24701070443',
      confirmed_at: '2024-04-21T11:47:52.86Z',
      raw_hex:
        '4d22030221022104210707010ab8660100000000000aba66010000000000093d3a26e822000120072103d382278438b567787da799287d0f6d19b98a625865b4e7087cd9cfd0df5d0d67010108000020220441038000d10733f38978d8675de08974f801ef7ff57d8203284d740086f2bbfb09b40c086c6f636b5f666565210185000064a7b3b6e00d0000000000000000000000000000000041038000d10733f38978d8675de08974f801ef7ff57d8203284d740086f2bbfb09b40c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6858018dbf54db21d6672040000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6858018dbf54db21d667204000000000000000000000000000041038000d1aa50c20c34dbc1789d7bf60f201e3c71140a9054478c76bae7a4d957300c147472795f6465706f7369745f6f725f61626f727421028100000000220000202000220000202200220001210120074101528579bd740cd0dfa8cd23f5cf2f5670b917b54389b813fda53eb080b9c83ae3529d7e9441cab8bbb4b89ec9c4a3dde054260b241eeff640457b379201255a38',
      receipt: { status: 'CommittedSuccess' },
      manifest_classes: ['Transfer', 'General'],
    },
  ],
}

export const submitTransactionResponse = { duplicate: false }