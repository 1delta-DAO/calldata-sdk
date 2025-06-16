import { Interface, Address } from 'fuels';
import _ from 'lodash';
import { zeroAddress } from 'viem';

// src/fuel/constants/pathConstants.ts
var MIRA_AMM_ID = "0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7";
var MIRA_HOOKS_ID = "0xa703db08d1dbf30a6cd2fef942d8dcf03f25d2254e2091ee1f97bf5fa615639e";
var DIESEL_AMM_ID = "0x7c293b054938bedca41354203be4c08aec2c3466412cac803f4ad62abf22e476";
var DEAD_LOGGER = "0x60caa3fe777329cd32a66a4c7ac5840e4eb10441a1f8331cd00d45fb0341a7a6";
var ScriptFunctions = /* @__PURE__ */ ((ScriptFunctions2) => {
  ScriptFunctions2["Main"] = "main";
  return ScriptFunctions2;
})(ScriptFunctions || {});
var BPS_BASE = 10000n;

// src/fuel/abi/batch_swap_exact_in_script-loader-abi.json
var batch_swap_exact_in_script_loader_abi_default = {
  programType: "script",
  specVersion: "1",
  encodingVersion: "1",
  concreteTypes: [
    {
      type: "()",
      concreteTypeId: "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      type: "(u64, u64, bool, struct std::vec::Vec<struct executor::BatchSwapStep>)",
      concreteTypeId: "d92fbce49fc9ac385fdcdbb8bad061913a363bfa83c405e7194625e8a5639f76",
      metadataTypeId: 0
    },
    {
      type: "str",
      concreteTypeId: "8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a"
    },
    {
      type: "struct std::contract_id::ContractId",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      metadataTypeId: 11
    },
    {
      type: "struct std::vec::Vec<(u64, u64, bool, struct std::vec::Vec<struct executor::BatchSwapStep>)>",
      concreteTypeId: "326cc48cff70b2dd19f1f375f4eeacadfd740a765b773399a2a193eae514b3e7",
      metadataTypeId: 13,
      typeArguments: [
        "d92fbce49fc9ac385fdcdbb8bad061913a363bfa83c405e7194625e8a5639f76"
      ]
    },
    {
      type: "u32",
      concreteTypeId: "d7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc"
    }
  ],
  metadataTypes: [
    {
      type: "(_, _, _, _)",
      metadataTypeId: 0,
      components: [
        {
          name: "__tuple_element",
          typeId: 14
        },
        {
          name: "__tuple_element",
          typeId: 14
        },
        {
          name: "__tuple_element",
          typeId: 2
        },
        {
          name: "__tuple_element",
          typeId: 13,
          typeArguments: [
            {
              name: "",
              typeId: 6
            }
          ]
        }
      ]
    },
    {
      type: "b256",
      metadataTypeId: 1
    },
    {
      type: "bool",
      metadataTypeId: 2
    },
    {
      type: "enum std::identity::Identity",
      metadataTypeId: 3,
      components: [
        {
          name: "Address",
          typeId: 7
        },
        {
          name: "ContractId",
          typeId: 11
        }
      ]
    },
    {
      type: "generic T",
      metadataTypeId: 4
    },
    {
      type: "raw untyped ptr",
      metadataTypeId: 5
    },
    {
      type: "struct executor::BatchSwapStep",
      metadataTypeId: 6,
      components: [
        {
          name: "dex_id",
          typeId: 14
        },
        {
          name: "asset_in",
          typeId: 8
        },
        {
          name: "asset_out",
          typeId: 8
        },
        {
          name: "receiver",
          typeId: 3
        },
        {
          name: "data",
          typeId: 9
        }
      ]
    },
    {
      type: "struct std::address::Address",
      metadataTypeId: 7,
      components: [
        {
          name: "bits",
          typeId: 1
        }
      ]
    },
    {
      type: "struct std::asset_id::AssetId",
      metadataTypeId: 8,
      components: [
        {
          name: "bits",
          typeId: 1
        }
      ]
    },
    {
      type: "struct std::bytes::Bytes",
      metadataTypeId: 9,
      components: [
        {
          name: "buf",
          typeId: 10
        },
        {
          name: "len",
          typeId: 14
        }
      ]
    },
    {
      type: "struct std::bytes::RawBytes",
      metadataTypeId: 10,
      components: [
        {
          name: "ptr",
          typeId: 5
        },
        {
          name: "cap",
          typeId: 14
        }
      ]
    },
    {
      type: "struct std::contract_id::ContractId",
      metadataTypeId: 11,
      components: [
        {
          name: "bits",
          typeId: 1
        }
      ]
    },
    {
      type: "struct std::vec::RawVec",
      metadataTypeId: 12,
      components: [
        {
          name: "ptr",
          typeId: 5
        },
        {
          name: "cap",
          typeId: 14
        }
      ],
      typeParameters: [
        4
      ]
    },
    {
      type: "struct std::vec::Vec",
      metadataTypeId: 13,
      components: [
        {
          name: "buf",
          typeId: 12,
          typeArguments: [
            {
              name: "",
              typeId: 4
            }
          ]
        },
        {
          name: "len",
          typeId: 14
        }
      ],
      typeParameters: [
        4
      ]
    },
    {
      type: "u64",
      metadataTypeId: 14
    }
  ],
  functions: [
    {
      inputs: [
        {
          name: "swap_path",
          concreteTypeId: "326cc48cff70b2dd19f1f375f4eeacadfd740a765b773399a2a193eae514b3e7"
        },
        {
          name: "deadline",
          concreteTypeId: "d7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc"
        }
      ],
      name: "main",
      output: "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      attributes: null
    }
  ],
  loggedTypes: [
    {
      logId: "10098701174489624218",
      concreteTypeId: "8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a"
    }
  ],
  messagesTypes: [],
  configurables: [
    {
      name: "MIRA_AMM_CONTRACT_ID",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      offset: 120
    },
    {
      name: "ONE_DELTA_ORDERS_CONTRACT_ID",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      offset: 152
    },
    {
      name: "LOGGER_CONTRACT_ID",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      offset: 88
    }
  ]
};

// src/fuel/abi/batch_swap_exact_out_script-loader-abi.json
var batch_swap_exact_out_script_loader_abi_default = {
  programType: "script",
  specVersion: "1",
  encodingVersion: "1",
  concreteTypes: [
    {
      type: "()",
      concreteTypeId: "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      type: "(u64, u64, bool, struct std::vec::Vec<struct executor::BatchSwapStep>)",
      concreteTypeId: "d92fbce49fc9ac385fdcdbb8bad061913a363bfa83c405e7194625e8a5639f76",
      metadataTypeId: 0
    },
    {
      type: "str",
      concreteTypeId: "8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a"
    },
    {
      type: "struct std::contract_id::ContractId",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      metadataTypeId: 11
    },
    {
      type: "struct std::vec::Vec<(u64, u64, bool, struct std::vec::Vec<struct executor::BatchSwapStep>)>",
      concreteTypeId: "326cc48cff70b2dd19f1f375f4eeacadfd740a765b773399a2a193eae514b3e7",
      metadataTypeId: 13,
      typeArguments: [
        "d92fbce49fc9ac385fdcdbb8bad061913a363bfa83c405e7194625e8a5639f76"
      ]
    },
    {
      type: "u32",
      concreteTypeId: "d7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc"
    }
  ],
  metadataTypes: [
    {
      type: "(_, _, _, _)",
      metadataTypeId: 0,
      components: [
        {
          name: "__tuple_element",
          typeId: 14
        },
        {
          name: "__tuple_element",
          typeId: 14
        },
        {
          name: "__tuple_element",
          typeId: 2
        },
        {
          name: "__tuple_element",
          typeId: 13,
          typeArguments: [
            {
              name: "",
              typeId: 6
            }
          ]
        }
      ]
    },
    {
      type: "b256",
      metadataTypeId: 1
    },
    {
      type: "bool",
      metadataTypeId: 2
    },
    {
      type: "enum std::identity::Identity",
      metadataTypeId: 3,
      components: [
        {
          name: "Address",
          typeId: 7
        },
        {
          name: "ContractId",
          typeId: 11
        }
      ]
    },
    {
      type: "generic T",
      metadataTypeId: 4
    },
    {
      type: "raw untyped ptr",
      metadataTypeId: 5
    },
    {
      type: "struct executor::BatchSwapStep",
      metadataTypeId: 6,
      components: [
        {
          name: "dex_id",
          typeId: 14
        },
        {
          name: "asset_in",
          typeId: 8
        },
        {
          name: "asset_out",
          typeId: 8
        },
        {
          name: "receiver",
          typeId: 3
        },
        {
          name: "data",
          typeId: 9
        }
      ]
    },
    {
      type: "struct std::address::Address",
      metadataTypeId: 7,
      components: [
        {
          name: "bits",
          typeId: 1
        }
      ]
    },
    {
      type: "struct std::asset_id::AssetId",
      metadataTypeId: 8,
      components: [
        {
          name: "bits",
          typeId: 1
        }
      ]
    },
    {
      type: "struct std::bytes::Bytes",
      metadataTypeId: 9,
      components: [
        {
          name: "buf",
          typeId: 10
        },
        {
          name: "len",
          typeId: 14
        }
      ]
    },
    {
      type: "struct std::bytes::RawBytes",
      metadataTypeId: 10,
      components: [
        {
          name: "ptr",
          typeId: 5
        },
        {
          name: "cap",
          typeId: 14
        }
      ]
    },
    {
      type: "struct std::contract_id::ContractId",
      metadataTypeId: 11,
      components: [
        {
          name: "bits",
          typeId: 1
        }
      ]
    },
    {
      type: "struct std::vec::RawVec",
      metadataTypeId: 12,
      components: [
        {
          name: "ptr",
          typeId: 5
        },
        {
          name: "cap",
          typeId: 14
        }
      ],
      typeParameters: [
        4
      ]
    },
    {
      type: "struct std::vec::Vec",
      metadataTypeId: 13,
      components: [
        {
          name: "buf",
          typeId: 12,
          typeArguments: [
            {
              name: "",
              typeId: 4
            }
          ]
        },
        {
          name: "len",
          typeId: 14
        }
      ],
      typeParameters: [
        4
      ]
    },
    {
      type: "u64",
      metadataTypeId: 14
    }
  ],
  functions: [
    {
      inputs: [
        {
          name: "swap_path",
          concreteTypeId: "326cc48cff70b2dd19f1f375f4eeacadfd740a765b773399a2a193eae514b3e7"
        },
        {
          name: "deadline",
          concreteTypeId: "d7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc"
        }
      ],
      name: "main",
      output: "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      attributes: null
    }
  ],
  loggedTypes: [
    {
      logId: "10098701174489624218",
      concreteTypeId: "8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a"
    }
  ],
  messagesTypes: [],
  configurables: [
    {
      name: "MIRA_AMM_CONTRACT_ID",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      offset: 120
    },
    {
      name: "ONE_DELTA_ORDERS_CONTRACT_ID",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      offset: 152
    },
    {
      name: "LOGGER_CONTRACT_ID",
      concreteTypeId: "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      offset: 88
    }
  ]
};

// ../../node_modules/.pnpm/@1delta+asset-registry@0.0.155/node_modules/@1delta/asset-registry/dist/index.mjs
var Chain = /* @__PURE__ */ ((Chain2) => {
  Chain2["ETHEREUM_MAINNET"] = "1";
  Chain2["OP_MAINNET"] = "10";
  Chain2["GNOSIS"] = "100";
  Chain2["GTON_MAINNET"] = "1000";
  Chain2["ETHOS"] = "100000000";
  Chain2["QUARKCHAIN_MAINNET_SHARD_0"] = "100001";
  Chain2["QUARKCHAIN_MAINNET_SHARD_1"] = "100002";
  Chain2["QUARKCHAIN_MAINNET_SHARD_2"] = "100003";
  Chain2["QUARKCHAIN_MAINNET_SHARD_3"] = "100004";
  Chain2["QUARKCHAIN_MAINNET_SHARD_4"] = "100005";
  Chain2["QUARKCHAIN_MAINNET_SHARD_5"] = "100006";
  Chain2["QUARKCHAIN_MAINNET_SHARD_6"] = "100007";
  Chain2["QUARKCHAIN_MAINNET_SHARD_7"] = "100008";
  Chain2["VECHAIN"] = "100009";
  Chain2["GON_CHAIN"] = "10024";
  Chain2["AEON_CHAIN"] = "10025";
  Chain2["TECTUM_EMISSION_TOKEN"] = "1003";
  Chain2["EURUS_MAINNET"] = "1008";
  Chain2["JUMBOCHAIN_MAINNET"] = "1009";
  Chain2["METANOVA_VERSE"] = "10096";
  Chain2["GLOBAL_TRUST_NETWORK"] = "101010";
  Chain2["SOVERUN_MAINNET"] = "10101010";
  Chain2["REBUS_CLASSIC_MAINNET"] = "1011";
  Chain2["MAXXCHAIN_MAINNET"] = "10201";
  Chain2["CREDITCOIN"] = "102030";
  Chain2["GLSCAN"] = "10222";
  Chain2["ALIENX_MAINNET"] = "10241024";
  Chain2["ARTHERA_MAINNET"] = "10242";
  Chain2["ZERO_XTADE"] = "10248";
  Chain2["BITTORRENT_CHAIN_DONAU"] = "1029";
  Chain2["WORLDLAND_MAINNET"] = "103";
  Chain2["CONFLUX_ESPACE"] = "1030";
  Chain2["CRYSTALEUM"] = "103090";
  Chain2["TAO_EVM_MAINNET"] = "10321";
  Chain2["KASPACLASSIC_MAINNET"] = "104566";
  Chain2["NUMBERS_MAINNET"] = "10507";
  Chain2["STRATIS_MAINNET"] = "105105";
  Chain2["VELAS_EVM_MAINNET"] = "106";
  Chain2["THUNDERCORE_MAINNET"] = "108";
  Chain2["MINTARA_MAINNET"] = "1080";
  Chain2["CRYPTOCOINPAY"] = "10823";
  Chain2["LAMINA1"] = "10849";
  Chain2["LAMINA1_IDENTITY"] = "10850";
  Chain2["METIS_ANDROMEDA_MAINNET"] = "1088";
  Chain2["BROCHAIN_MAINNET"] = "108801";
  Chain2["HUMANS_AI_MAINNET"] = "1089";
  Chain2["SHIBARIUM"] = "109";
  Chain2["QUADRANS_BLOCKCHAIN"] = "10946";
  Chain2["DYMENSION"] = "1100";
  Chain2["KB_CHAIN"] = "11000";
  Chain2["POLYGON_ZKEVM"] = "1101";
  Chain2["BLXQ_MAINNET"] = "1108";
  Chain2["WEMIX3_0_MAINNET"] = "1111";
  Chain2["ASTRA"] = "11110";
  Chain2["WAGMI"] = "11111";
  Chain2["SIBERIUM_NETWORK"] = "111111";
  Chain2["RE_AL"] = "111188";
  Chain2["HASHBIT_MAINNET"] = "11119";
  Chain2["ALPHABET_MAINNET"] = "111222333444";
  Chain2["CORE_BLOCKCHAIN_MAINNET"] = "1116";
  Chain2["DOGCOIN_MAINNET"] = "1117";
  Chain2["COINBIT_MAINNET"] = "112";
  Chain2["SHINE_CHAIN"] = "11221";
  Chain2["HAQQ_NETWORK"] = "11235";
  Chain2["METACHAIN_ONE_MAINNET"] = "112358";
  Chain2["TAKER_CHAIN_MAINNET"] = "1125";
  Chain2["TILTYARD_SUBNET"] = "1127469";
  Chain2["PALM"] = "11297108109";
  Chain2["DEHVO"] = "113";
  Chain2["LISK"] = "1135";
  Chain2["EGOLD_CHAIN"] = "11451";
  Chain2["CYBERDECKNET"] = "1146703430";
  Chain2["SYMPLEXIA_SMART_CHAIN"] = "1149";
  Chain2["BEVM_MAINNET"] = "11501";
  Chain2["SATSCHAIN"] = "11521";
  Chain2["UPTICK_MAINNET"] = "117";
  Chain2["ARTELA_MAINNET"] = "11820";
  Chain2["CLUBMOS_MAINNET"] = "1188";
  Chain2["POLYGON_SUPERNET_ARIANEE"] = "11891";
  Chain2["ENULS_MAINNET"] = "119";
  Chain2["IORA_CHAIN"] = "1197";
  Chain2["CUCKOO_CHAIN"] = "1200";
  Chain2["SATOSHICHAIN_MAINNET"] = "12009";
  Chain2["WORLD_TRADE_TECHNICAL_CHAIN_MAINNET"] = "1202";
  Chain2["ATERNOS"] = "12020";
  Chain2["LUMMIO_NETWORK"] = "12020498";
  Chain2["SINGULARITY_ZERO_MAINNET"] = "12052";
  Chain2["SAITABLOCKCHAINSBC"] = "1209";
  Chain2["REALCHAIN_MAINNET"] = "121";
  Chain2["FUSHUMA"] = "121224";
  Chain2["BRC_CHAIN_MAINNET"] = "12123";
  Chain2["POPCATEUM_MAINNET"] = "1213";
  Chain2["ENTERCHAIN_MAINNET"] = "1214";
  Chain2["ADF_CHAIN"] = "1215";
  Chain2["FUSE_MAINNET"] = "122";
  Chain2["EXZO_NETWORK_MAINNET"] = "1229";
  Chain2["FIBONACCI_MAINNET"] = "12306";
  Chain2["ULTRON_MAINNET"] = "1231";
  Chain2["HUDDLE01_DRTC_CHAIN"] = "12323";
  Chain2["L3X_PROTOCOL"] = "12324";
  Chain2["GEMCHAIN"] = "123321";
  Chain2["STEP_NETWORK"] = "1234";
  Chain2["PIN"] = "123420000558";
  Chain2["VOLMEX"] = "123420000588";
  Chain2["SHARECLE_MAINNET"] = "1234567";
  Chain2["ITX_MAINNET"] = "1235";
  Chain2["GDPR_MAINNET"] = "12358";
  Chain2["ARC_MAINNET"] = "1243";
  Chain2["OM_PLATFORM_MAINNET"] = "1246";
  Chain2["DOGETHER_MAINNET"] = "1248";
  Chain2["RSS3_VSL_MAINNET"] = "12553";
  Chain2["OYCHAIN_MAINNET"] = "126";
  Chain2["HUMAN_PROTOCOL"] = "1273227453";
  Chain2["OFFICIAL_VASYL"] = "1278060416";
  Chain2["HUOBI_ECO_CHAIN_MAINNET"] = "128";
  Chain2["HALO_MAINNET"] = "1280";
  Chain2["MOONBEAM"] = "1284";
  Chain2["MOONRIVER"] = "1285";
  Chain2["INNOVATOR_CHAIN"] = "129";
  Chain2["ARGOCHAIN"] = "1299";
  Chain2["UNICHAIN"] = "130";
  Chain2["GLUE_MAINNET"] = "1300";
  Chain2["SPS"] = "13000";
  Chain2["DOS_FUJI_SUBNET"] = "1311";
  Chain2["JAIHO_CHAIN"] = "1313";
  Chain2["ETHO_PROTOCOL"] = "1313114";
  Chain2["AURORA_MAINNET"] = "1313161554";
  Chain2["POWERGOLD"] = "1313161560";
  Chain2["TURBO"] = "1313161567";
  Chain2["ALYX_MAINNET"] = "1314";
  Chain2["ETND_CHAIN_MAINNETS"] = "131419";
  Chain2["AIA_MAINNET"] = "1319";
  Chain2["SEI_NETWORK"] = "1329";
  Chain2["CREDIT_SMART_CHAIN"] = "13308";
  Chain2["IMMUTABLE_ZKEVM"] = "13371";
  Chain2["PHOENIX_MAINNET"] = "13381";
  Chain2["ELYSIUM_MAINNET"] = "1339";
  Chain2["MASA"] = "13396";
  Chain2["IEXEC_SIDECHAIN"] = "134";
  Chain2["BLITZ_SUBNET"] = "1343";
  Chain2["SKALE_TITAN_HUB"] = "1350216234";
  Chain2["CIC_CHAIN_MAINNET"] = "1353";
  Chain2["DEAMCHAIN_MAINNET"] = "136";
  Chain2["KRONOBIT_MAINNET"] = "13600";
  Chain2["ZAFIRIUM_MAINNET"] = "1369";
  Chain2["POLYGON_MAINNET"] = "137";
  Chain2["RAMESTTA_MAINNET"] = "1370";
  Chain2["KALAR_CHAIN"] = "1379";
  Chain2["DEFI_ORACLE_META_MAINNET"] = "138";
  Chain2["RARI_CHAIN_MAINNET"] = "1380012617";
  Chain2["RAPTORCHAIN"] = "1380996178";
  Chain2["SUSONO"] = "13812";
  Chain2["AMSTAR_MAINNET"] = "1388";
  Chain2["WOOPCHAIN_MAINNET"] = "139";
  Chain2["JOSEON_MAINNET"] = "1392";
  Chain2["FLARE_MAINNET"] = "14";
  Chain2["BITHARVEST_CHAIN_MAINNET"] = "14149";
  Chain2["BITLAZER"] = "14235";
  Chain2["ICPLAZA_MAINNET"] = "142857";
  Chain2["ANDUSCHAIN_MAINNET"] = "14288640";
  Chain2["RIKEZA_NETWORK_MAINNET"] = "1433";
  Chain2["PHI_NETWORK_V2"] = "144";
  Chain2["CTEX_SCAN_BLOCKCHAIN"] = "1455";
  Chain2["ZKBASE_MAINNET"] = "1456";
  Chain2["SONIC_MAINNET"] = "146";
  Chain2["FLAG_MAINNET"] = "147";
  Chain2["SHIMMEREVM"] = "148";
  Chain2["VANA"] = "1480";
  Chain2["SKALE_NEBULA_HUB"] = "1482601649";
  Chain2["VITRUVEO_MAINNET"] = "1490";
  Chain2["BEVM_CANARY"] = "1501";
  Chain2["SHERPAX_MAINNET"] = "1506";
  Chain2["REDBELLY_NETWORK_MAINNET"] = "151";
  Chain2["GPT_MAINNET"] = "1511670449";
  Chain2["STORY"] = "1514";
  Chain2["BEAGLE_MESSAGING_CHAIN"] = "1515";
  Chain2["POODL_MAINNET"] = "15259";
  Chain2["ODYSSEY_CHAIN_MAINNET"] = "153153";
  Chain2["KYMTC_MAINNET"] = "15430";
  Chain2["DATACORE_SMART_CHAIN"] = "1555";
  Chain2["LOOPNETWORK_MAINNET"] = "15551";
  Chain2["TENET"] = "1559";
  Chain2["SKALE_CALYPSO_HUB"] = "1564830818";
  Chain2["PUPPYNET"] = "157";
  Chain2["STARCHAIN"] = "1578";
  Chain2["ROBURNA_MAINNET"] = "158";
  Chain2["CRYPTOX"] = "158245";
  Chain2["XCOIN"] = "158345";
  Chain2["BETHERANCE"] = "1605";
  Chain2["DEFIVERSE_MAINNET"] = "16116";
  Chain2["CYPHERIUM_MAINNET"] = "16166";
  Chain2["ETHEREUM_INSCRIPTION_MAINNET"] = "1617";
  Chain2["PLYR_PHI"] = "16180";
  Chain2["GRAVITY_ALPHA_MAINNET"] = "1625";
  Chain2["PIVOTAL_MAINNET"] = "1648";
  Chain2["GENESYS_MAINNET"] = "16507";
  Chain2["ECLAT_MAINNET"] = "165279";
  Chain2["OMNI"] = "166";
  Chain2["HARMONY_MAINNET_SHARD_0"] = "1666600000";
  Chain2["HARMONY_MAINNET_SHARD_1"] = "1666600001";
  Chain2["TAIKO_ALETHIA"] = "167000";
  Chain2["AIRDAO_MAINNET"] = "16718";
  Chain2["AIOZ_NETWORK"] = "168";
  Chain2["ZCHAINS"] = "168168";
  Chain2["NERO_MAINNET"] = "1689";
  Chain2["MANTA_PACIFIC_MAINNET"] = "169";
  Chain2["ANYTYPE_EVM_CHAIN"] = "1701";
  Chain2["GARNET_HOLESKY"] = "17069";
  Chain2["TBSI_MAINNET"] = "1707";
  Chain2["ONCHAIN_POINTS"] = "17071";
  Chain2["CO2E_LEDGER"] = "171";
  Chain2["DORIC_NETWORK"] = "1717";
  Chain2["G8CHAIN_MAINNET"] = "17171";
  Chain2["WADZCHAIN_MAINNET"] = "171717";
  Chain2["ECLIPSE_SUBNET"] = "17172";
  Chain2["PALETTE_CHAIN_MAINNET"] = "1718";
  Chain2["KONET_MAINNET"] = "17217";
  Chain2["REYA_NETWORK"] = "1729";
  Chain2["METAL_L2"] = "1750";
  Chain2["DC_MAINNET"] = "176";
  Chain2["HASHKEY_CHAIN"] = "177";
  Chain2["PARTYCHAIN"] = "1773";
  Chain2["GAUSS_MAINNET"] = "1777";
  Chain2["EOS_EVM_NETWORK"] = "17777";
  Chain2["ABEY_MAINNET"] = "179";
  Chain2["AME_CHAIN_MAINNET"] = "180";
  Chain2["MANDE_NETWORK_MAINNET"] = "18071918";
  Chain2["SMART_TRADE_NETWORKS"] = "18122";
  Chain2["PROOF_OF_MEMES"] = "18159";
  Chain2["CUBE_CHAIN_MAINNET"] = "1818";
  Chain2["IOST_MAINNET"] = "182";
  Chain2["RUBY_SMART_CHAIN_MAINNET"] = "1821";
  Chain2["PLAYBLOCK"] = "1829";
  Chain2["ETHERNITY"] = "183";
  Chain2["MINT_MAINNET"] = "185";
  Chain2["HIGHOCTANE_SUBNET"] = "1853";
  Chain2["SEELE_MAINNET"] = "186";
  Chain2["SONEIUM"] = "1868";
  Chain2["MXC_ZKEVM_MOONCHAIN"] = "18686";
  Chain2["DOJIMA"] = "187";
  Chain2["WHITECHAIN"] = "1875";
  Chain2["BMC_MAINNET"] = "188";
  Chain2["BITICA_CHAIN_MAINNET"] = "188710";
  Chain2["TITAN_TKX"] = "18888";
  Chain2["LIGHTLINK_PHOENIX_MAINNET"] = "1890";
  Chain2["BON_NETWORK"] = "1898";
  Chain2["REDEFI_LAYER_2"] = "1899";
  Chain2["SONGBIRD_CANARY_NETWORK"] = "19";
  Chain2["CMDAO_BBQ_CHAIN"] = "190";
  Chain2["HOME_VERSE_MAINNET"] = "19011";
  Chain2["SPORTS_CHAIN_NETWORK"] = "1904";
  Chain2["BITCICHAIN_MAINNET"] = "1907";
  Chain2["MERKLE_SCAN"] = "1909";
  Chain2["SCALIND"] = "1911";
  Chain2["LOCACHAIN_MAINNET"] = "19180";
  Chain2["BLOCKX_MAINNET"] = "19191";
  Chain2["DECENTRACONNECT_SOCIAL"] = "19224";
  Chain2["SWELLCHAIN"] = "1923";
  Chain2["GATHER_MAINNET_NETWORK"] = "192837465";
  Chain2["CRYPTO_EMERGENCY"] = "193";
  Chain2["R0AR_CHAIN"] = "193939";
  Chain2["SEC_MAINNET"] = "19516";
  Chain2["X_LAYER_MAINNET"] = "196";
  Chain2["LBRY_MAINNET"] = "19600";
  Chain2["SELENDRA_NETWORK_MAINNET"] = "1961";
  Chain2["SUPER_SMART_CHAIN_MAINNET"] = "1970";
  Chain2["ONUS_CHAIN_MAINNET"] = "1975";
  Chain2["NTITY_MAINNET"] = "197710212030";
  Chain2["BITCHAIN_MAINNET"] = "198";
  Chain2["BTCIX_NETWORK"] = "19845";
  Chain2["SATOSHIE"] = "1985";
  Chain2["DEEPBRAINCHAIN_MAINNET"] = "19880818";
  Chain2["BITTORRENT_CHAIN_MAINNET"] = "199";
  Chain2["EKTA"] = "1994";
  Chain2["SANKO"] = "1996";
  Chain2["KYOTO"] = "1997";
  Chain2["ULTRA_EVM_NETWORK"] = "19991";
  Chain2["ELASTOS_SMART_CHAIN"] = "20";
  Chain2["ARBITRUM_ON_XDAI"] = "200";
  Chain2["DOGECHAIN_MAINNET"] = "2000";
  Chain2["CAMELARK_MAINNET"] = "20001";
  Chain2["MILKOMEDA_C1_MAINNET"] = "2001";
  Chain2["MILKOMEDA_A1_MAINNET"] = "2002";
  Chain2["ZOO_MAINNET"] = "200200";
  Chain2["METALINK_NETWORK"] = "2004";
  Chain2["NIZA_CHAIN_MAINNET"] = "20041";
  Chain2["BITLAYER_MAINNET"] = "200901";
  Chain2["ALAYA_MAINNET"] = "201018";
  Chain2["MAINNETZ_MAINNET"] = "2016";
  Chain2["MYTHICAL_CHAIN"] = "201804";
  Chain2["SMARTMESH_MAINNET"] = "20180430";
  Chain2["QUARKBLOCKCHAIN"] = "20181205";
  Chain2["RONIN_MAINNET"] = "2020";
  Chain2["PEGO_NETWORK"] = "20201022";
  Chain2["EDGEWARE_EDGEEVM_MAINNET"] = "2021";
  Chain2["BETHEL_SYDNEY"] = "202202";
  Chain2["DBK_CHAIN"] = "20240603";
  Chain2["BLOCKFIT"] = "202424";
  Chain2["RANGERS_PROTOCOL_MAINNET"] = "2025";
  Chain2["ETP_MAINNET"] = "20256789";
  Chain2["EDGELESS_NETWORK"] = "2026";
  Chain2["WOWCHAIN_MAINNET"] = "203";
  Chain2["CENTRIFUGE"] = "2031";
  Chain2["KIWI_SUBNET"] = "2037";
  Chain2["ALEPH_ZERO"] = "2039";
  Chain2["OPBNB_MAINNET"] = "204";
  Chain2["VANAR_MAINNET"] = "2040";
  Chain2["X1_NETWORK"] = "204005";
  Chain2["XUSD_ONE_STABLECHAIN_MAINNET"] = "20441";
  Chain2["SKALE_EUROPA_HUB"] = "2046399126";
  Chain2["STRATOS"] = "2048";
  Chain2["MOVO_SMART_CHAIN_MAINNET"] = "2049";
  Chain2["VINUCHAIN_NETWORK"] = "207";
  Chain2["METACCES_MAINNET"] = "2071";
  Chain2["P12_CHAIN"] = "20736";
  Chain2["JONO11_SUBNET"] = "20765";
  Chain2["QUOKKACOIN_MAINNET"] = "2077";
  Chain2["PLIAN_MAINNET_MAIN"] = "2099156";
  Chain2["BITNET"] = "210";
  Chain2["ECOBALL_MAINNET"] = "2100";
  Chain2["CORN"] = "21000000";
  Chain2["C4EI"] = "21004";
  Chain2["PLATON_MAINNET"] = "210425";
  Chain2["EXOSAMA_NETWORK"] = "2109";
  Chain2["UCHAIN_MAINNET"] = "2112";
  Chain2["ALL_ABOUT_HEALTHY"] = "21133";
  Chain2["LITENTRY"] = "212013";
  Chain2["CATENA_MAINNET"] = "2121";
  Chain2["METAPLAYERONE_MAINNET"] = "2122";
  Chain2["DCPAY_MAINNET"] = "21223";
  Chain2["B2_HUB_MAINNET"] = "213";
  Chain2["CENNZNET_AZALEA"] = "21337";
  Chain2["LESTNET"] = "21363";
  Chain2["SHINARIUM_MAINNET"] = "214";
  Chain2["ONENESS_NETWORK"] = "2140";
  Chain2["BOSAGORA_MAINNET"] = "2151";
  Chain2["FINDORA_MAINNET"] = "2152";
  Chain2["SIRIUSNET_V2"] = "217";
  Chain2["OMCHAIN_MAINNET"] = "21816";
  Chain2["GAME7"] = "2187";
  Chain2["BSL_MAINNET"] = "21912";
  Chain2["SNAXCHAIN"] = "2192";
  Chain2["MOONSAMA_NETWORK"] = "2199";
  Chain2["ANTOFY_MAINNET"] = "2202";
  Chain2["TAYCAN"] = "22023";
  Chain2["BITCOIN_EVM"] = "2203";
  Chain2["MAS_MAINNET"] = "220315";
  Chain2["EXCELON_MAINNET"] = "22052002";
  Chain2["BLOCKEX_MAINNET"] = "221";
  Chain2["REAPCHAIN_MAINNET"] = "221230";
  Chain2["EVANESCO_MAINNET"] = "2213";
  Chain2["KAVA"] = "2222";
  Chain2["NAUTILUS_MAINNET"] = "22222";
  Chain2["HYDRATION"] = "222222";
  Chain2["COINWEB_BNB_SHARD"] = "2222222";
  Chain2["VCHAIN_MAINNET"] = "2223";
  Chain2["DEEPL_MAINNET"] = "222555";
  Chain2["B2_MAINNET"] = "223";
  Chain2["KREST_NETWORK"] = "2241";
  Chain2["TAF_ECO_CHAIN_MAINNET"] = "224168";
  Chain2["CONET_MAINNET"] = "224400";
  Chain2["CONET_HOLESKY"] = "224433";
  Chain2["LACHAIN_MAINNET"] = "225";
  Chain2["PROM"] = "227";
  Chain2["MAP_PROTOCOL"] = "22776";
  Chain2["SWAPDEX"] = "230";
  Chain2["BOMB_CHAIN"] = "2300";
  Chain2["PREMIUMBLOCK"] = "23023";
  Chain2["CRATD2C"] = "2310";
  Chain2["LENS"] = "232";
  Chain2["OASIS_SAPPHIRE"] = "23294";
  Chain2["ALTCOINCHAIN"] = "2330";
  Chain2["SOMA_NETWORK_MAINNET"] = "2332";
  Chain2["OMNIA_CHAIN"] = "2342";
  Chain2["GOAT_NETWORK"] = "2345";
  Chain2["DREYERX_MAINNET"] = "23451";
  Chain2["SILICON_ZKEVM"] = "2355";
  Chain2["BLAST_MAINNET"] = "238";
  Chain2["TAC_EVM"] = "2390";
  Chain2["TCG_VERSE_MAINNET"] = "2400";
  Chain2["K2_MAINNET"] = "2410";
  Chain2["XODEX"] = "2415";
  Chain2["PLINGA_MAINNET"] = "242";
  Chain2["RUFUS"] = "2420";
  Chain2["KING_OF_LEGENDS_MAINNET"] = "2425";
  Chain2["NEON_EVM_MAINNET"] = "245022934";
  Chain2["ENERGY_WEB_CHAIN"] = "246";
  Chain2["HYBRID_CHAIN_NETWORK_MAINNET"] = "2468";
  Chain2["SIX_DEGREE_OF_OUTREACH"] = "2477";
  Chain2["OASYS_MAINNET"] = "248";
  Chain2["NOW_CHAIN_MAINNET"] = "2488";
  Chain2["CRONOS_MAINNET"] = "25";
  Chain2["FANTOM_OPERA"] = "250";
  Chain2["LIQUIDLAYER_MAINNET"] = "25186";
  Chain2["FRAXTAL"] = "252";
  Chain2["INEVM_MAINNET"] = "2525";
  Chain2["GLIDE_L2_PROTOCOL_XP"] = "253";
  Chain2["EVERCLEAR_MAINNET"] = "25327";
  Chain2["FLAME"] = "253368190";
  Chain2["SWAN_CHAIN_MAINNET"] = "254";
  Chain2["KROMA"] = "255";
  Chain2["BAHAMUT_HORIZON"] = "2552";
  Chain2["CMP_MAINNET"] = "256256";
  Chain2["TECHPAY_MAINNET"] = "2569";
  Chain2["HAMMER_CHAIN_MAINNET"] = "25888";
  Chain2["NEONLINK_MAINNET"] = "259";
  Chain2["GURU_NETWORK"] = "260";
  Chain2["PHO_BLOCKCHAIN_MAINNET"] = "2605";
  Chain2["POCRNET"] = "2606";
  Chain2["FERRUM_QUANTUM_PORTAL_NETWORK"] = "26100";
  Chain2["REDLIGHT_CHAIN_MAINNET"] = "2611";
  Chain2["EZCHAIN_C_CHAIN_MAINNET"] = "2612";
  Chain2["SUR_BLOCKCHAIN_NETWORK"] = "262";
  Chain2["DUCATUSX"] = "26483";
  Chain2["AILAYER_MAINNET"] = "2649";
  Chain2["HERTZ_NETWORK_MAINNET"] = "26600";
  Chain2["OASISCHAIN_MAINNET"] = "26863";
  Chain2["HIGH_PERFORMANCE_BLOCKCHAIN"] = "269";
  Chain2["SHIBACHAIN"] = "27";
  Chain2["XTERIO_CHAIN_ETH"] = "2702128";
  Chain2["EXCOINCIAL_CHAIN_MAINNET"] = "27082022";
  Chain2["EGONCOIN_MAINNET"] = "271";
  Chain2["DCHAIN"] = "2716446429837000";
  Chain2["K_LAOS"] = "2718";
  Chain2["NXY_AREA_51"] = "272247";
  Chain2["NXY_OASIS"] = "272520";
  Chain2["XR_ONE"] = "273";
  Chain2["LACHAIN"] = "274";
  Chain2["ABSTRACT"] = "2741";
  Chain2["NANON"] = "2748";
  Chain2["GM_NETWORK_MAINNET"] = "2777";
  Chain2["ZEROONE_MAINNET_SUBNET"] = "27827";
  Chain2["RAZOR_SKALE_CHAIN"] = "278611351";
  Chain2["BPX_CHAIN"] = "279";
  Chain2["ATHENE_PARTHENON"] = "281123";
  Chain2["MORPH"] = "2818";
  Chain2["VIZING_MAINNET"] = "28518";
  Chain2["BOBA_NETWORK"] = "288";
  Chain2["AARMA_MAINNET"] = "2889";
  Chain2["GENESIS_L1"] = "29";
  Chain2["FLACHAIN_MAINNET"] = "29032022";
  Chain2["ELUX_CHAIN"] = "2907";
  Chain2["ORDERLY_MAINNET"] = "291";
  Chain2["HYCHAIN"] = "2911";
  Chain2["NEXA_METANET"] = "29223";
  Chain2["DAVINCI"] = "293";
  Chain2["HEDERA_MAINNET"] = "295";
  Chain2["MCH_VERSE_MAINNET"] = "29548";
  Chain2["HEDERA_PREVIEWNET"] = "297";
  Chain2["BITYUAN_MAINNET"] = "2999";
  Chain2["ROOTSTOCK_MAINNET"] = "30";
  Chain2["QCHAIN_MAINNET"] = "30000";
  Chain2["CENNZNET_NIKAU"] = "3001";
  Chain2["CANXIUM_MAINNET"] = "3003";
  Chain2["MIYOU_MAINNET"] = "30088";
  Chain2["PLAYA3ULL_GAMES"] = "3011";
  Chain2["BC_HYPER_CHAIN_MAINNET"] = "3030";
  Chain2["ORLANDO_CHAIN"] = "3031";
  Chain2["ZKSATS_MAINNET"] = "305";
  Chain2["BIFROST_MAINNET"] = "3068";
  Chain2["FURTHEON"] = "308";
  Chain2["ONE_WORLD_CHAIN_MAINNET"] = "309075";
  Chain2["OMAX_MAINNET"] = "311";
  Chain2["ONELEDGER_MAINNET"] = "311752642";
  Chain2["CLOUDTX_MAINNET"] = "31223";
  Chain2["NEUROCHAIN_MAINNET"] = "313";
  Chain2["FILECOIN_MAINNET"] = "314";
  Chain2["WIREX_PAY_MAINNET"] = "31415";
  Chain2["WORLDECOMONEY"] = "315";
  Chain2["KCC_MAINNET"] = "321";
  Chain2["PAREX_MAINNET"] = "322202";
  Chain2["COSVM_MAINNET"] = "323";
  Chain2["SANTIMENT_INTELLIGENCE_NETWORK"] = "32382";
  Chain2["ZKSYNC_MAINNET"] = "324";
  Chain2["BITGERT_MAINNET"] = "32520";
  Chain2["FUSION_MAINNET"] = "32659";
  Chain2["ZILLIQA_EVM"] = "32769";
  Chain2["ZILLIQA_2_EVM_PROTO_MAINNET"] = "32770";
  Chain2["NAL_MAINNET"] = "328527";
  Chain2["ZILLIQA_EVM_ISOLATED_SERVER"] = "32990";
  Chain2["ENTANGLE_MAINNET"] = "33033";
  Chain2["TTCOIN_SMART_CHAIN_MAINNET"] = "330844";
  Chain2["CURTIS"] = "33111";
  Chain2["APECHAIN"] = "33139";
  Chain2["CLOUDVERSE_SUBNET"] = "33210";
  Chain2["WEB3Q_MAINNET"] = "333";
  Chain2["MELD"] = "333000333";
  Chain2["BLOOM_GENESIS_MAINNET"] = "333313";
  Chain2["AVES_MAINNET"] = "33333";
  Chain2["WEB3Q_GALILEO"] = "3334";
  Chain2["PEAQ"] = "3338";
  Chain2["SLINGSHOT"] = "33401";
  Chain2["SHIDEN"] = "336";
  Chain2["MERONEUM"] = "3366";
  Chain2["UPCHAIN_MAINNET"] = "336666";
  Chain2["FUNKI"] = "33979";
  Chain2["SECURECHAIN_MAINNET"] = "34";
  Chain2["PARIBU_NET_MAINNET"] = "3400";
  Chain2["EVOLVE_MAINNET"] = "3424";
  Chain2["MODE"] = "34443";
  Chain2["TSC_MAINNET"] = "345";
  Chain2["ZEUS_MAINNET"] = "34504";
  Chain2["GTCSCAN"] = "3490";
  Chain2["CITRONUS_CITRO"] = "34949059";
  Chain2["JFIN_CHAIN"] = "3501";
  Chain2["J2O_TARO"] = "35011";
  Chain2["JFINPOS"] = "3502";
  Chain2["Q_MAINNET"] = "35441";
  Chain2["BITFINITY_NETWORK_MAINNET"] = "355110";
  Chain2["DXCHAIN_MAINNET"] = "36";
  Chain2["SHAPE"] = "360";
  Chain2["PANDOPROJECT_MAINNET"] = "3601";
  Chain2["LAVITA_MAINNET"] = "360890";
  Chain2["THETA_MAINNET"] = "361";
  Chain2["DIGIT_SOUL_SMART_CHAIN_2"] = "363636";
  Chain2["BOTANIX_MAINNET"] = "3637";
  Chain2["ICHAIN_NETWORK"] = "3639";
  Chain2["JOULEVERSE_MAINNET"] = "3666";
  Chain2["PULSECHAIN"] = "369";
  Chain2["BITTEX_MAINNET"] = "3690";
  Chain2["EMPIRE_NETWORK"] = "3693";
  Chain2["SENJEPOWERS_MAINNET"] = "3699";
  Chain2["XPLA_MAINNET"] = "37";
  Chain2["CROSSBELL"] = "3737";
  Chain2["ASTAR_ZKEVM"] = "3776";
  Chain2["ALVEYCHAIN_MAINNET"] = "3797";
  Chain2["ZKAMOEBA_MAINNET"] = "381";
  Chain2["METAL_C_CHAIN"] = "381931";
  Chain2["METAL_TAHOE_C_CHAIN"] = "381932";
  Chain2["ZENIQ"] = "383414847825";
  Chain2["CONNECTORMANAGER"] = "38400";
  Chain2["CONNECTORMANAGER_ROBIN"] = "38401";
  Chain2["CRONOS_ZKEVM_MAINNET"] = "388";
  Chain2["KALYCHAIN_MAINNET"] = "3888";
  Chain2["U2U_SOLARIS_MAINNET"] = "39";
  Chain2["DRAC_NETWORK"] = "3912";
  Chain2["PRM_MAINNET"] = "39656";
  Chain2["DYNO_MAINNET"] = "3966";
  Chain2["PAYNETWORK_MAINNET"] = "3969";
  Chain2["NEAR_PROTOCOL"] = "397";
  Chain2["OHO_MAINNET"] = "39815";
  Chain2["NATIV3_MAINNET"] = "399";
  Chain2["KINGDOM_CHAIN"] = "39916801";
  Chain2["YUANCHAIN_MAINNET"] = "3999";
  Chain2["TELOS_EVM_MAINNET"] = "40";
  Chain2["OZONE_CHAIN_MAINNET"] = "4000";
  Chain2["DIV_CHAIN"] = "40000";
  Chain2["ALTLAYER_ZERO_GAS_NETWORK"] = "4000003";
  Chain2["X1_FASTNET"] = "4003";
  Chain2["SYNDR_L3"] = "404";
  Chain2["TIPBOXCOIN_MAINNET"] = "404040";
  Chain2["BAHAMUT_OCEAN"] = "4058";
  Chain2["NAHMII_3_MAINNET"] = "4061";
  Chain2["MUSTER_MAINNET"] = "4078";
  Chain2["ZEROTH_MAINNET"] = "4088";
  Chain2["BITINDI_MAINNET"] = "4099";
  Chain2["PEPE_CHAIN_MAINNET"] = "411";
  Chain2["ALEPH_ZERO_EVM"] = "41455";
  Chain2["OPULENT_X_BETA"] = "41500";
  Chain2["CROSSFI_MAINNET"] = "4158";
  Chain2["SX_NETWORK_MAINNET"] = "416";
  Chain2["SX_ROLLUP"] = "4162";
  Chain2["PHI_NETWORK_V1"] = "4181";
  Chain2["EDU_CHAIN"] = "41923";
  Chain2["LUKSO_MAINNET"] = "42";
  Chain2["MERLIN_MAINNET"] = "4200";
  Chain2["INFINAEON"] = "420000";
  Chain2["PMON_CHAIN"] = "42001";
  Chain2["VECTOR_SMART_CHAIN"] = "420042";
  Chain2["DONATUZ"] = "42026";
  Chain2["KEKCHAIN"] = "420420";
  Chain2["WESTEND_ASSET_HUB"] = "420420421";
  Chain2["ARBITRUM_ONE"] = "42161";
  Chain2["ARBITRUM_NOVA"] = "42170";
  Chain2["VIRIDIS_MAINNET"] = "422";
  Chain2["CELO_MAINNET"] = "42220";
  Chain2["OASIS_EMERALD"] = "42262";
  Chain2["GOLDXCHAIN_MAINNET"] = "42355";
  Chain2["PGN_PUBLIC_GOODS_NETWORK"] = "424";
  Chain2["NEXI_MAINNET"] = "4242";
  Chain2["ASSET_CHAIN_MAINNET"] = "42420";
  Chain2["NEXI_V2_MAINNET"] = "4243";
  Chain2["STENIX_MAINNET"] = "425";
  Chain2["THE_WIDOWS_MITE"] = "426";
  Chain2["ZEETH_CHAIN"] = "427";
  Chain2["ZKFAIR_MAINNET"] = "42766";
  Chain2["ETHERLINK_MAINNET"] = "42793";
  Chain2["GESO_VERSE"] = "428";
  Chain2["HEMI_NETWORK"] = "43111";
  Chain2["AVALANCHE_C_CHAIN"] = "43114";
  Chain2["ECHOS_CHAIN"] = "4321";
  Chain2["DEXALOT_SUBNET"] = "432204";
  Chain2["BEAM"] = "4337";
  Chain2["BOYAA_MAINNET"] = "434";
  Chain2["CRAB_NETWORK"] = "44";
  Chain2["CREDIT_SMART_CHAIN_MAINNET"] = "4400";
  Chain2["GRAPHITE_MAINNET"] = "440017";
  Chain2["HTMLCOIN_MAINNET"] = "4444";
  Chain2["FRENCHAIN"] = "44444";
  Chain2["QUANTUM_NETWORK"] = "44445";
  Chain2["HYDRA_CHAIN"] = "4488";
  Chain2["AUTOBAHN_NETWORK"] = "45000";
  Chain2["EMONEY_NETWORK_MAINNET"] = "4545";
  Chain2["SWAMPS_L2"] = "45454";
  Chain2["DEELANCE_MAINNET"] = "45510";
  Chain2["BLESSNET"] = "45513";
  Chain2["ARZIO_CHAIN"] = "456";
  Chain2["DARWINIA_NETWORK"] = "46";
  Chain2["VERY_MAINNET"] = "4613";
  Chain2["AREON_NETWORK_MAINNET"] = "463";
  Chain2["MST_CHAIN"] = "4646";
  Chain2["APPCHAIN"] = "466";
  Chain2["IOTEX_NETWORK_MAINNET"] = "4689";
  Chain2["ACRIA_INTELLICHAIN"] = "47";
  Chain2["ULTRA_PRO_MAINNET"] = "473861";
  Chain2["OPENCHAIN_MAINNET"] = "474142";
  Chain2["NEO_X_MAINNET"] = "47763";
  Chain2["FORM_NETWORK"] = "478";
  Chain2["REDEFI_LAYER_1"] = "47803";
  Chain2["REI_NETWORK"] = "47805";
  Chain2["ENNOTHEM_MAINNET_PROTEROZOIC"] = "48";
  Chain2["WORLD_CHAIN"] = "480";
  Chain2["ZIRCUIT_MAINNET"] = "48900";
  Chain2["GLOBEL_CHAIN"] = "4893";
  Chain2["OEV_NETWORK"] = "4913";
  Chain2["VENIDIUM_MAINNET"] = "4919";
  Chain2["RUPAYA"] = "499";
  Chain2["XDC_NETWORK"] = "50";
  Chain2["CAMINO_C_CHAIN"] = "500";
  Chain2["MANTLE"] = "5000";
  Chain2["CITRONUS"] = "50000";
  Chain2["YOOLDO_VERSE_MAINNET"] = "50005";
  Chain2["TREASURENET_MAINNET_ALPHA"] = "5002";
  Chain2["SOPHON"] = "50104";
  Chain2["ONIGIRI_SUBNET"] = "5040";
  Chain2["PLAYDAPP_NETWORK"] = "504441";
  Chain2["SKATE_MAINNET"] = "5050";
  Chain2["PIONEER_ZERO_CHAIN"] = "5080";
  Chain2["ERBIE_MAINNET"] = "50888";
  Chain2["XDC_APOTHEM_NETWORK"] = "51";
  Chain2["HAM"] = "5112";
  Chain2["NUMBLOCK_CHAIN"] = "5112023";
  Chain2["DOUBLE_A_CHAIN_MAINNET"] = "512";
  Chain2["DISCHAIN"] = "513100";
  Chain2["BAHAMUT"] = "5165";
  Chain2["SMART_LAYER_NETWORK"] = "5169";
  Chain2["SARDIS_MAINNET"] = "51712";
  Chain2["TLCHAIN_NETWORK_MAINNET"] = "5177";
  Chain2["COINEX_SMART_CHAIN_MAINNET"] = "52";
  Chain2["XT_SMART_CHAIN_MAINNET"] = "520";
  Chain2["ELECTRONEUM_MAINNET"] = "52014";
  Chain2["HUMANODE_MAINNET"] = "5234";
  Chain2["DOCOIN_COMMUNITY_CHAIN"] = "526916";
  Chain2["FXCORE_MAINNET_NETWORK"] = "530";
  Chain2["DOID"] = "53277";
  Chain2["SUPERSEED"] = "5330";
  Chain2["NETSBO"] = "5333";
  Chain2["CANDLE"] = "534";
  Chain2["SCROLL"] = "534352";
  Chain2["SHINARIUM_BETA"] = "534849";
  Chain2["BEANECO_SMARTCHAIN"] = "535037";
  Chain2["OPTRUST_MAINNET"] = "537";
  Chain2["SETTLUS"] = "5371";
  Chain2["DFK_CHAIN"] = "53935";
  Chain2["OPENPIECE_MAINNET"] = "54";
  Chain2["OVERPROTOCOL_MAINNET"] = "54176";
  Chain2["EDEXA_MAINNET"] = "5424";
  Chain2["ZERO_NETWORK"] = "543210";
  Chain2["EGOCHAIN"] = "5439";
  Chain2["SAGA"] = "5464";
  Chain2["ZYX_MAINNET"] = "55";
  Chain2["RIVER"] = "550";
  Chain2["TITAN"] = "55004";
  Chain2["POINTPAY_MAINNET"] = "5511";
  Chain2["SUPERPOSITION"] = "55244";
  Chain2["VELA1_CHAIN_MAINNET"] = "555";
  Chain2["NAHMII_2_MAINNET"] = "5551";
  Chain2["CHAIN_VERSE_MAINNET"] = "5555";
  Chain2["REI_CHAIN_MAINNET"] = "55555";
  Chain2["IMVERSED_MAINNET"] = "5555555";
  Chain2["DUSTBOY_IOT"] = "555888";
  Chain2["FLAMMA_MAINNET"] = "55614";
  Chain2["BNB_SMART_CHAIN_MAINNET"] = "56";
  Chain2["LAMBDA_CHAIN_MAINNET"] = "56026";
  Chain2["BOBA_BNB_MAINNET"] = "56288";
  Chain2["QIE_BLOCKCHAIN"] = "5656";
  Chain2["TANSSI_DEMO"] = "5678";
  Chain2["VELO_LABS_MAINNET"] = "56789";
  Chain2["SYSCOIN_MAINNET"] = "57";
  Chain2["ROLLUX_MAINNET"] = "570";
  Chain2["INK"] = "57073";
  Chain2["METACHAIN_MAINNET"] = "571";
  Chain2["COINSEC_NETWORK"] = "57451";
  Chain2["FILENOVA_MAINNET"] = "579";
  Chain2["ONTOLOGY_MAINNET"] = "58";
  Chain2["TANGLE"] = "5845";
  Chain2["CHANG_CHAIN_FOUNDATION_MAINNET"] = "5858";
  Chain2["WEGOCHAIN_RUBIDIUM_MAINNET"] = "5869";
  Chain2["LINEA"] = "59144";
  Chain2["ASTAR"] = "592";
  Chain2["GENESYS_CODE_MAINNET"] = "59971";
  Chain2["GOCHAIN"] = "60";
  Chain2["BOUNCEBIT_MAINNET"] = "6001";
  Chain2["TRES_MAINNET"] = "6066";
  Chain2["BOB"] = "60808";
  Chain2["ETHEREUM_CLASSIC"] = "61";
  Chain2["ORANGE_CHAIN_MAINNET"] = "61022";
  Chain2["TREASURE"] = "61166";
  Chain2["UPTN"] = "6119";
  Chain2["EIOB_MAINNET"] = "612";
  Chain2["GRAPHLINQ_BLOCKCHAIN_MAINNET"] = "614";
  Chain2["KAICHAIN"] = "61406";
  Chain2["ETICA_MAINNET"] = "61803";
  Chain2["SKYNET"] = "619";
  Chain2["DOKEN_SUPER_CHAIN_MAINNET"] = "61916";
  Chain2["OPTOPIA_MAINNET"] = "62050";
  Chain2["HYPRA_MAINNET"] = "622277";
  Chain2["BINARY_MAINNET"] = "624";
  Chain2["MULTIVAC_MAINNET"] = "62621";
  Chain2["RAILS"] = "6278";
  Chain2["LAOS"] = "6283";
  Chain2["ESYNC_NETWORK_MAINNET"] = "63000";
  Chain2["GEIST_MAINNET"] = "63157";
  Chain2["NFB_CHAIN"] = "632";
  Chain2["AURA_MAINNET"] = "6322";
  Chain2["AVOCADO"] = "634";
  Chain2["BEAR_NETWORK_CHAIN_MAINNET"] = "641230";
  Chain2["ENDURANCE_SMART_CHAIN_MAINNET"] = "648";
  Chain2["ALL_MAINNET"] = "651940";
  Chain2["VECNO_MAINNET"] = "65357";
  Chain2["KALICHAIN"] = "654";
  Chain2["SCOLCOIN_MAINNET"] = "65450";
  Chain2["CYBERCHAIN_MAINNET"] = "65535";
  Chain2["AUTOMATA_MAINNET"] = "65536";
  Chain2["OKXCHAIN_MAINNET"] = "66";
  Chain2["XAI_MAINNET"] = "660279";
  Chain2["ULTRONSMARTCHAIN"] = "662";
  Chain2["PIXIE_CHAIN_MAINNET"] = "6626";
  Chain2["CYBRIA_MAINNET"] = "6661";
  Chain2["PDC_MAINNET"] = "666301171999";
  Chain2["SAFEANWANG_MAINNET"] = "6666665";
  Chain2["DEGEN_CHAIN"] = "666666666";
  Chain2["STORCHAIN"] = "6667";
  Chain2["EDGE_MATRIX_CHAIN"] = "6678";
  Chain2["JUNCACHAIN"] = "668";
  Chain2["CONWAI_MAINNET"] = "668668";
  Chain2["IRISHUB"] = "6688";
  Chain2["PAXB_MAINNET"] = "6701";
  Chain2["COMPVERSE_MAINNET"] = "6779";
  Chain2["GOLD_SMART_CHAIN_MAINNET"] = "6789";
  Chain2["RACE_MAINNET"] = "6805";
  Chain2["KARURA_NETWORK"] = "686";
  Chain2["POOLS_MAINNET"] = "6868";
  Chain2["WON_NETWORK"] = "686868";
  Chain2["DM2_VERSE_MAINNET"] = "68770";
  Chain2["MTT_MAINNET"] = "6880";
  Chain2["REDSTONE"] = "690";
  Chain2["LAIKA_MAINNET"] = "6942";
  Chain2["TOMB_CHAIN_MAINNET"] = "6969";
  Chain2["MATCHAIN"] = "698";
  Chain2["THAICHAIN"] = "7";
  Chain2["HOO_SMART_CHAIN"] = "70";
  Chain2["ZETACHAIN_MAINNET"] = "7000";
  Chain2["THINKIUM_MAINNET_CHAIN_0"] = "70000";
  Chain2["THINKIUM_MAINNET_CHAIN_1"] = "70001";
  Chain2["THINKIUM_MAINNET_CHAIN_2"] = "70002";
  Chain2["BST_CHAIN"] = "7007";
  Chain2["THINKIUM_MAINNET_CHAIN_103"] = "70103";
  Chain2["ELLA_THE_HEART"] = "7027";
  Chain2["FIDESINNOVA"] = "706883";
  Chain2["BLOCKCHAIN_STATION_MAINNET"] = "707";
  Chain2["PLANQ_MAINNET"] = "7070";
  Chain2["PROOF_OF_PLAY_APEX"] = "70700";
  Chain2["PROOF_OF_PLAY_BOSS"] = "70701";
  Chain2["HIGHBURY"] = "710";
  Chain2["NUME"] = "7100";
  Chain2["TILTYARD_MAINNET_SUBNET"] = "710420";
  Chain2["GUAPCOINX"] = "71111";
  Chain2["ZERO_XL3"] = "7117";
  Chain2["VRCSCAN_MAINNET"] = "713";
  Chain2["GODWOKEN_MAINNET"] = "71402";
  Chain2["ZETHER_MAINNET"] = "715131";
  Chain2["BITROCK_MAINNET"] = "7171";
  Chain2["SHIBARIUM_BETA"] = "719";
  Chain2["EXSAT_MAINNET"] = "7200";
  Chain2["LYCAN_CHAIN"] = "721";
  Chain2["ERAM_MAINNET"] = "721529";
  Chain2["SAAKURU_MAINNET"] = "7225878";
  Chain2["INITVERSE_MAINNET"] = "7233";
  Chain2["TRON_MAINNET"] = "728126428";
  Chain2["CAGA_MAINNET"] = "72888";
  Chain2["GROK_CHAIN_MAINNET"] = "72992";
  Chain2["FNCY"] = "73";
  Chain2["LOVELY_NETWORK_MAINNET"] = "730";
  Chain2["XPLA_VERSE"] = "7300";
  Chain2["ICB_NETWORK"] = "73115";
  Chain2["HORIZEN_EON_MAINNET"] = "7332";
  Chain2["SHYFT_MAINNET"] = "7341";
  Chain2["OPENVESSEL"] = "7355310";
  Chain2["MIXIN_VIRTUAL_MACHINE"] = "73927";
  Chain2["IDCHAIN_MAINNET"] = "74";
  Chain2["TRANCHED_MAINNET"] = "743";
  Chain2["EVM_ON_FLOW"] = "747";
  Chain2["RABA_NETWORK_MAINNET"] = "7484";
  Chain2["DECIMAL_SMART_CHAIN_MAINNET"] = "75";
  Chain2["MEVERSE_CHAIN_MAINNET"] = "7518";
  Chain2["TERNOA"] = "752025";
  Chain2["RIVALZ"] = "753";
  Chain2["GEEK_VERSE_MAINNET"] = "75512";
  Chain2["CYBER_MAINNET"] = "7560";
  Chain2["PAYSCAN_CHAIN"] = "756689";
  Chain2["ADIL_CHAIN_V2_MAINNET"] = "7576";
  Chain2["MIEXS_SMARTCHAIN"] = "761412";
  Chain2["QL1"] = "766";
  Chain2["THE_ROOT_NETWORK_MAINNET"] = "7668";
  Chain2["POA_NETWORK_SOKOL"] = "77";
  Chain2["CANTO"] = "7700";
  Chain2["BORACHAIN_MAINNET"] = "77001";
  Chain2["VENTION_SMART_CHAIN_MAINNET"] = "77612";
  Chain2["MODULARIUM"] = "776877";
  Chain2["GDCC_MAINNET"] = "7774";
  Chain2["PANDASEA_MAINNET"] = "7776";
  Chain2["TORONET_MAINNET"] = "77777";
  Chain2["ZORA"] = "7777777";
  Chain2["ORENIUM_MAINNET_PROTOCOL"] = "7778";
  Chain2["DRAGONFLY_MAINNET_HEXAPOD"] = "78281";
  Chain2["AMPLIFY_SUBNET"] = "78430";
  Chain2["BULLETIN_SUBNET"] = "78431";
  Chain2["CONDUIT_SUBNET"] = "78432";
  Chain2["MAAL_CHAIN"] = "786";
  Chain2["MAALCHAIN_V2"] = "7862";
  Chain2["POWERLOOM_MAINNET"] = "7865";
  Chain2["ZEBRO_SMART_CHAIN"] = "786786";
  Chain2["ACALA_NETWORK"] = "787";
  Chain2["KINTO_MAINNET"] = "7887";
  Chain2["PATEX"] = "789";
  Chain2["ARDENIUM_ATHENA"] = "7895";
  Chain2["ARENA_Z"] = "7897";
  Chain2["ZENITH_MAINNET"] = "79";
  Chain2["DOT_BLOX"] = "7923";
  Chain2["MO_MAINNET"] = "7924";
  Chain2["SX_TORONTO_ROLLUP"] = "79479957";
  Chain2["DOS_CHAIN"] = "7979";
  Chain2["UBIQ"] = "8";
  Chain2["GENECHAIN"] = "80";
  Chain2["LUCID_BLOCKCHAIN"] = "800";
  Chain2["TELEPORT"] = "8000";
  Chain2["OCTASPACE"] = "800001";
  Chain2["PLIAN_MAINNET_SUBCHAIN_1"] = "8007736";
  Chain2["POLYNOMIAL"] = "8008";
  Chain2["FHENIX_HELIUM"] = "8008135";
  Chain2["BERACHAIN"] = "80094";
  Chain2["HIZOCO_MAINNET"] = "80096";
  Chain2["ISUNCOIN_MAINNET"] = "8017";
  Chain2["BOAT_MAINNET"] = "8047";
  Chain2["EVOZ_MAINNET"] = "805";
  Chain2["SHARDEUM_LIBERTY_1_X"] = "8080";
  Chain2["HOKUM"] = "8080808";
  Chain2["SHARDEUM_LIBERTY_2_X"] = "8081";
  Chain2["SHARDEUM_SPHINX_1_X"] = "8082";
  Chain2["FORTA_CHAIN"] = "80931";
  Chain2["JAPAN_OPEN_CHAIN_MAINNET"] = "81";
  Chain2["ZKLINK_NOVA_MAINNET"] = "810180";
  Chain2["NORDEK_MAINNET"] = "81041";
  Chain2["SG_VERSE_MAINNET"] = "812397";
  Chain2["QITMEER_NETWORK_MAINNET"] = "813";
  Chain2["BLAST"] = "81457";
  Chain2["QUANTUM_CHAIN_MAINNET"] = "81720";
  Chain2["BEONE_CHAIN_MAINNET"] = "818";
  Chain2["TORUS_MAINNET"] = "8192";
  Chain2["METER_MAINNET"] = "82";
  Chain2["CALLISTO_MAINNET"] = "820";
  Chain2["KAIA_MAINNET"] = "8217";
  Chain2["SPACE_SUBNET"] = "8227";
  Chain2["DAILY_NETWORK_MAINNET"] = "824";
  Chain2["VEMP_HORIZON"] = "82614";
  Chain2["BLOCKTON_BLOCKCHAIN"] = "8272";
  Chain2["CURVE_MAINNET"] = "827431";
  Chain2["LORENZO"] = "8329";
  Chain2["B3"] = "8333";
  Chain2["ZEDXION"] = "83872";
  Chain2["TARAXA_MAINNET"] = "841";
  Chain2["THAT_MAINNET"] = "8428";
  Chain2["BASE"] = "8453";
  Chain2["O_CHAIN"] = "84841";
  Chain2["AERIE_NETWORK"] = "84886";
  Chain2["HONGKONG_MAINNET"] = "852";
  Chain2["DODAO"] = "855456";
  Chain2["GATECHAIN_MAINNET"] = "86";
  Chain2["ELECTRA_NETWORK"] = "861";
  Chain2["HELA_OFFICIAL_RUNTIME_MAINNET"] = "8668";
  Chain2["FANTASIA_CHAIN_MAINNET"] = "868";
  Chain2["NOVA_NETWORK"] = "87";
  Chain2["TOOL_GLOBAL_MAINNET"] = "8723";
  Chain2["STORAGECHAIN_MAINNET"] = "8726";
  Chain2["BULLIONS_SMART_CHAIN"] = "8732";
  Chain2["ALPH_NETWORK"] = "8738";
  Chain2["BANDAI_NAMCO_RESEARCH_VERSE_MAINNET"] = "876";
  Chain2["DEXIT_NETWORK"] = "877";
  Chain2["BLOCX_MAINNET"] = "879151";
  Chain2["HAPCHAIN"] = "8794598";
  Chain2["AMBROS_CHAIN_MAINNET"] = "880";
  Chain2["HAVEN1"] = "8811";
  Chain2["IOTA_EVM"] = "8822";
  Chain2["MARO_BLOCKCHAIN_MAINNET"] = "8848";
  Chain2["INOAI"] = "88559";
  Chain2["SUPERLUMIO"] = "8866";
  Chain2["LIF3_CHAIN"] = "8869";
  Chain2["WANCHAIN"] = "888";
  Chain2["UNIQUE"] = "8880";
  Chain2["ZKASINO_MAINNET"] = "88800";
  Chain2["QUARTZ_BY_UNIQUE"] = "8881";
  Chain2["UNIT_ZERO_STAGENET"] = "88819";
  Chain2["SAPPHIRE_BY_UNIQUE"] = "8883";
  Chain2["XANACHAIN"] = "8888";
  Chain2["CHILIZ_CHAIN_MAINNET"] = "88888";
  Chain2["REXX_MAINNET"] = "888882";
  Chain2["VISION_MAINNET"] = "888888";
  Chain2["T_E_A_M_BLOCKCHAIN"] = "88888888";
  Chain2["ANCIENT8"] = "888888888";
  Chain2["UNITE"] = "88899";
  Chain2["MAMMOTH_MAINNET"] = "8898";
  Chain2["JIBCHAIN_L1"] = "8899";
  Chain2["PTCESCAN_MAINNET"] = "889910246";
  Chain2["ALGEN"] = "8911";
  Chain2["ALGEN_LAYER2"] = "8921";
  Chain2["REYA_CRONOS"] = "89346162";
  Chain2["GIANT_MAMMOTH_MAINNET"] = "8989";
  Chain2["MAXI_CHAIN_MAINNET"] = "899";
  Chain2["GARIZON_STAGE0"] = "90";
  Chain2["POSICHAIN_MAINNET_SHARD_0"] = "900000";
  Chain2["UBIT_SMARTCHAIN_MAINNET"] = "90002";
  Chain2["EVMOS"] = "9001";
  Chain2["SHIDO_MAINNET_BLOCK"] = "9008";
  Chain2["BERYLBIT_MAINNET"] = "9012";
  Chain2["NEXA_MAINNET_BLOCK"] = "9025";
  Chain2["GARIZON_STAGE1"] = "91";
  Chain2["TAPROOT_MAINNET"] = "911";
  Chain2["HENEZ_CHAIN_MAINNET"] = "91111";
  Chain2["METADAP_ENTERPRISE_MAINNET"] = "91120";
  Chain2["ASTRIA_EVM_DUSKNET"] = "912559";
  Chain2["SLERFCHAIN_MAINNET"] = "918";
  Chain2["GARIZON_STAGE2"] = "92";
  Chain2["CODEFIN_MAINNET"] = "9223";
  Chain2["YIDARK_CHAIN_MAINNET"] = "927";
  Chain2["GARIZON_STAGE3"] = "93";
  Chain2["XCAP"] = "9322252";
  Chain2["HAUST_MAINNET"] = "938";
  Chain2["EVOKE_MAINNET"] = "9395";
  Chain2["SWISSDLT"] = "94";
  Chain2["CAMDL_MAINNET"] = "95";
  Chain2["SRICHAIN"] = "95432";
  Chain2["JONO12_SUBNET"] = "955081";
  Chain2["ELUVIO_CONTENT_FABRIC"] = "955305";
  Chain2["LYRA_CHAIN"] = "957";
  Chain2["BITKUB_CHAIN"] = "96";
  Chain2["BTC20_SMART_CHAIN"] = "963";
  Chain2["LUX_MAINNET"] = "96369";
  Chain2["ETHXY"] = "969";
  Chain2["REBUS_MAINNET"] = "9696";
  Chain2["OORT_MAINNET"] = "970";
  Chain2["TETRON_SMART_CHAIN"] = "97055";
  Chain2["OORT_ASCRAEUS"] = "972";
  Chain2["PALM_SMART_CHAIN"] = "973";
  Chain2["SIDRA_CHAIN"] = "97453";
  Chain2["METABENZ_CHAIN"] = "97766";
  Chain2["PEPENETWORK_MAINNET"] = "9779";
  Chain2["OPTIMUSZ7_MAINNET"] = "9797";
  Chain2["SIX_PROTOCOL"] = "98";
  Chain2["TOP_MAINNET_EVM"] = "980";
  Chain2["IMPERIUM_MAINNET"] = "9819";
  Chain2["FORMA"] = "984122";
  Chain2["FORMA_SKETCHPAD"] = "984123";
  Chain2["MEMO_SMART_CHAIN_MAINNET"] = "985";
  Chain2["BINARYCHAIN_MAINNET"] = "987";
  Chain2["ECROX_CHAIN_MAINNET"] = "988207";
  Chain2["PLUME_LEGACY"] = "98865";
  Chain2["DOGELAYER_MAINNET"] = "9888";
  Chain2["LARISSA_CHAIN"] = "9898";
  Chain2["POA_NETWORK_CORE"] = "99";
  Chain2["ELIBERTY_MAINNET"] = "990";
  Chain2["ZYTRON_LINEA_MAINNET"] = "9901";
  Chain2["ESPENTO_MAINNET"] = "9911";
  Chain2["LUMIA_MAINNET"] = "994873017";
  Chain2["FIVE_IRECHAIN_MAINNET"] = "995";
  Chain2["COMBO_MAINNET"] = "9980";
  Chain2["VOLLEY_MAINNET"] = "9981";
  Chain2["MFEV_CHAIN_MAINNET"] = "9982";
  Chain2["AGUNG_NETWORK"] = "9990";
  Chain2["MIND_SMART_CHAIN_MAINNET"] = "9996";
  Chain2["AMCHAIN"] = "999999";
  Chain2["FLUENCE"] = "9999999";
  Chain2["VOLCANO_CHAIN_MAINNET"] = "10085";
  Chain2["BEVM_SIGNET"] = "11504";
  Chain2["BASECAMP"] = "123420001114";
  Chain2["COINZAX"] = "1310";
  Chain2["TUXAPPCOIN"] = "1313161573";
  Chain2["REACTIVE_MAINNET"] = "1597";
  Chain2["MUD_CHAIN"] = "168169";
  Chain2["PRIVIX_CHAIN_MAINNET"] = "16969696";
  Chain2["WITNESS_CHAIN"] = "1702448187";
  Chain2["ETHPAR_MAINNET"] = "1727";
  Chain2["ACTION_MAINNET"] = "21000";
  Chain2["MAGICHAIN"] = "24125";
  Chain2["ATLETA_NETWORK"] = "2440";
  Chain2["APERTUM"] = "2786";
  Chain2["XFERCHAIN_MAINNET"] = "28125";
  Chain2["ZKCANDY_MAINNET"] = "320";
  Chain2["PEPE_UNCHAINED"] = "3409";
  Chain2["XONE_MAINNET"] = "3721";
  Chain2["ARCADIA_MAINNET"] = "4278608";
  Chain2["MEMECORE"] = "4352";
  Chain2["JUNEO_MAINNET"] = "45003";
  Chain2["TRUMPCHAIN"] = "4547";
  Chain2["BLACKFORT_EXCHANGE_NETWORK"] = "488";
  Chain2["BIRDLAYER"] = "53456";
  Chain2["RARIMO"] = "7368";
  Chain2["OONE_CHAIN_MAINNET"] = "777888";
  Chain2["EMERALDZ"] = "789789";
  Chain2["ONFA_CHAIN"] = "8691942025";
  Chain2["WEBER_GOVERNANCE_MAINNET"] = "881";
  Chain2["MIRACLE_CHAIN"] = "92278";
  Chain2["Z_CHAIN"] = "9369";
  Chain2["LUMOZ_CHAIN_MAINNET"] = "96370";
  Chain2["LAGOM_MAINNET"] = "986";
  Chain2["PLUME_MAINNET"] = "98866";
  Chain2["POINTLEDGER"] = "9889";
  Chain2["FUEL"] = "fuel";
  Chain2["SOCOTRA_JUNE_CHAIN"] = "101003";
  Chain2["OPENGPU_MAINNET"] = "1071";
  Chain2["STATEMESH"] = "1134";
  Chain2["PERENNIAL"] = "1424";
  Chain2["ONINO_MAINNET"] = "1425";
  Chain2["EVENTUM_MAINNET"] = "161803";
  Chain2["ESPORTS_CHAIN"] = "17735";
  Chain2["SWISSTRONIK_MAINNET"] = "1848";
  Chain2["ALTBLOCKSCAN_MAINNET"] = "191919";
  Chain2["FIRACHAIN"] = "194";
  Chain2["XPHERE_MAINNET"] = "20250217";
  Chain2["VCITYCHAIN_MAINNET"] = "20250825";
  Chain2["IDN_MAINNET"] = "215";
  Chain2["CHOOCHAIN"] = "247";
  Chain2["TRON_SHASTA"] = "2494104990";
  Chain2["COTI"] = "2632500";
  Chain2["MEZO"] = "31612";
  Chain2["BASEDAI"] = "32323";
  Chain2["PENTAGON_CHAIN"] = "3344";
  Chain2["R5_NETWORK"] = "337";
  Chain2["GUNZ"] = "43419";
  Chain2["JUNEO_DAI1_CHAIN"] = "45004";
  Chain2["JUNEO_USDT1_CHAIN"] = "45005";
  Chain2["JUNEO_USD1_CHAIN"] = "45006";
  Chain2["JUNEO_MBTC1_CHAIN"] = "45007";
  Chain2["JUNEO_GLD1_CHAIN"] = "45008";
  Chain2["JUNEO_LTC1_CHAIN"] = "45009";
  Chain2["JUNEO_DOGE1_CHAIN"] = "45010";
  Chain2["JUNEO_EUR1_CHAIN"] = "45011";
  Chain2["JUNEO_SGD1_CHAIN"] = "45012";
  Chain2["JUNEO_BCH1_CHAIN"] = "45013";
  Chain2["JUNEO_LINK1_CHAIN"] = "45014";
  Chain2["INERTIA_SCAN"] = "5433";
  Chain2["WINR_PROTOCOL_MAINNET"] = "777777";
  Chain2["DRAW_COIN"] = "7788";
  Chain2["POWERLOOM_MAINNET_V2"] = "7869";
  Chain2["SHARDEUM"] = "8118";
  Chain2["XCHAIN"] = "94524";
  Chain2["HYPEREVM"] = "999";
  return Chain2;
})(Chain || {});
var Lender = /* @__PURE__ */ ((Lender2) => {
  Lender2["AAVE_V3"] = "AAVE_V3";
  Lender2["AAVE_V3_PRIME"] = "AAVE_V3_PRIME";
  Lender2["AAVE_V3_ETHER_FI"] = "AAVE_V3_ETHER_FI";
  Lender2["AAVE_V2"] = "AAVE_V2";
  Lender2["AURELIUS"] = "AURELIUS";
  Lender2["LENDLE"] = "LENDLE";
  Lender2["MERIDIAN"] = "MERIDIAN";
  Lender2["TAKOTAKO"] = "TAKOTAKO";
  Lender2["TAKOTAKO_ETH"] = "TAKOTAKO_ETH";
  Lender2["HANA"] = "HANA";
  Lender2["YLDR"] = "YLDR";
  Lender2["MAGSIN"] = "MAGSIN";
  Lender2["SPARK"] = "SPARK";
  Lender2["NEREUS"] = "NEREUS";
  Lender2["KINZA"] = "KINZA";
  Lender2["GRANARY"] = "GRANARY";
  Lender2["LORE"] = "LORE";
  Lender2["LENDOS"] = "LENDOS";
  Lender2["IRONCLAD_FINANCE"] = "IRONCLAD_FINANCE";
  Lender2["MOLEND"] = "MOLEND";
  Lender2["SEISMIC"] = "SEISMIC";
  Lender2["POLTER"] = "POLTER";
  Lender2["AGAVE"] = "AGAVE";
  Lender2["MOOLA"] = "MOOLA";
  Lender2["XLEND"] = "XLEND";
  Lender2["KLAP"] = "KLAP";
  Lender2["RHOMBUS"] = "RHOMBUS";
  Lender2["RMM"] = "RMM";
  Lender2["KLAYBANK"] = "KLAYBANK";
  Lender2["SAKE"] = "SAKE";
  Lender2["SAKE_ASTAR"] = "SAKE_ASTAR";
  Lender2["LAYERBANK_V3"] = "LAYERBANK_V3";
  Lender2["ZEROLEND"] = "ZEROLEND";
  Lender2["ZEROLEND_STABLECOINS_RWA"] = "ZEROLEND_STABLECOINS_RWA";
  Lender2["ZEROLEND_ETH_LRTS"] = "ZEROLEND_ETH_LRTS";
  Lender2["ZEROLEND_BTC_LRTS"] = "ZEROLEND_BTC_LRTS";
  Lender2["ZEROLEND_CROAK"] = "ZEROLEND_CROAK";
  Lender2["ZEROLEND_FOXY"] = "ZEROLEND_FOXY";
  Lender2["AVALON"] = "AVALON";
  Lender2["AVALON_SOLV_BTC"] = "AVALON_SOLV_BTC";
  Lender2["AVALON_SWELL_BTC"] = "AVALON_SWELL_BTC";
  Lender2["AVALON_PUMP_BTC"] = "AVALON_PUMP_BTC";
  Lender2["AVALON_UNIBTC"] = "AVALON_UNIBTC";
  Lender2["AVALON_EBTC_LBTC"] = "AVALON_EBTC_LBTC";
  Lender2["AVALON_USDA"] = "AVALON_USDA";
  Lender2["AVALON_SKAIA"] = "AVALON_SKAIA";
  Lender2["AVALON_LORENZO"] = "AVALON_LORENZO";
  Lender2["AVALON_INNOVATION"] = "AVALON_INNOVATION";
  Lender2["AVALON_UBTC"] = "AVALON_UBTC";
  Lender2["AVALON_OBTC"] = "AVALON_OBTC";
  Lender2["AVALON_BEETS"] = "AVALON_BEETS";
  Lender2["AVALON_UNILOTX"] = "AVALON_UNILOTX";
  Lender2["AVALON_BOB"] = "AVALON_BOB";
  Lender2["AVALON_STBTC"] = "AVALON_STBTC";
  Lender2["AVALON_WBTC"] = "AVALON_WBTC";
  Lender2["AVALON_LBTC"] = "AVALON_LBTC";
  Lender2["AVALON_XAUM"] = "AVALON_XAUM";
  Lender2["AVALON_LISTA"] = "AVALON_LISTA";
  Lender2["AVALON_USDX"] = "AVALON_USDX";
  Lender2["COMPOUND_V2"] = "COMPOUND_V2";
  Lender2["OVIX"] = "OVIX";
  Lender2["VENUS"] = "VENUS";
  Lender2["VENUS_ETH"] = "VENUS_ETH";
  Lender2["VENUS_BNB"] = "VENUS_BNB";
  Lender2["VENUS_BTC"] = "VENUS_BTC";
  Lender2["VENUS_MEME"] = "VENUS_MEME";
  Lender2["VENUS_DEFI"] = "VENUS_DEFI";
  Lender2["VENUS_GAMEFI"] = "VENUS_GAMEFI";
  Lender2["VENUS_STABLE"] = "VENUS_STABLE";
  Lender2["VENUS_TRON"] = "VENUS_TRON";
  Lender2["VENUS_ETHENA"] = "VENUS_ETHENA";
  Lender2["VENUS_CURVE"] = "VENUS_CURVE";
  Lender2["SEGMENT"] = "SEGMENT";
  Lender2["ENCLABS"] = "ENCLABS";
  Lender2["ENCLABS_LST"] = "ENCLABS_LST";
  Lender2["ENCLABS_PT_USD"] = "ENCLABS_PT_USD";
  Lender2["ENCLABS_PT_ETH"] = "ENCLABS_PT_ETH";
  Lender2["BENQI"] = "BENQI";
  Lender2["BENQI_AVALANCE_ECOSYSTEM"] = "BENQI_AVALANCE_ECOSYSTEM";
  Lender2["COMPOUND_V3_USDC"] = "COMPOUND_V3_USDC";
  Lender2["COMPOUND_V3_USDT"] = "COMPOUND_V3_USDT";
  Lender2["COMPOUND_V3_USDE"] = "COMPOUND_V3_USDE";
  Lender2["COMPOUND_V3_USDBC"] = "COMPOUND_V3_USDBC";
  Lender2["COMPOUND_V3_USDC_E"] = "COMPOUND_V3_USDC_E";
  Lender2["COMPOUND_V3_USDS"] = "COMPOUND_V3_USDS";
  Lender2["COMPOUND_V3_WETH"] = "COMPOUND_V3_WETH";
  Lender2["COMPOUND_V3_AERO"] = "COMPOUND_V3_AERO";
  Lender2["COMPOUND_V3_WSTETH"] = "COMPOUND_V3_WSTETH";
  Lender2["INIT"] = "INIT";
  Lender2["MORPHO_BLUE"] = "MORPHO_BLUE";
  Lender2["SWAYLEND_USDC"] = "SWAYLEND_USDC";
  return Lender2;
})(Lender || {});

// ../../node_modules/.pnpm/@1delta+dex-registry@0.0.53/node_modules/@1delta/dex-registry/dist/index.mjs
var DexProtocol = /* @__PURE__ */ ((DexProtocol2) => {
  DexProtocol2["BALANCER_V3"] = "BALANCER_V3";
  DexProtocol2["UNISWAP_V4"] = "UNISWAP_V4";
  DexProtocol2["UNISWAP_V2"] = "UNISWAP_V2";
  DexProtocol2["PANCAKESWAP_V2"] = "PANCAKESWAP_V2";
  DexProtocol2["BISWAP_V2"] = "BISWAP_V2";
  DexProtocol2["UBESWAP_V2"] = "UBESWAP_V2";
  DexProtocol2["FUSIONX_V2"] = "FUSIONX_V2";
  DexProtocol2["SUSHISWAP_V2"] = "SUSHISWAP_V2";
  DexProtocol2["METROPOLIS_V2"] = "METROPOLIS_V2";
  DexProtocol2["QUICKSWAP_V2"] = "QUICKSWAP_V2";
  DexProtocol2["SQUADSWAP_V2"] = "SQUADSWAP_V2";
  DexProtocol2["DFYN"] = "DFYN";
  DexProtocol2["BUTTER"] = "BUTTER";
  DexProtocol2["MERCHANT_MOE"] = "MERCHANT_MOE";
  DexProtocol2["TRADER_JOE_V1"] = "TRADER_JOE_V1";
  DexProtocol2["POLYCAT"] = "POLYCAT";
  DexProtocol2["APESWAP"] = "APESWAP";
  DexProtocol2["WAULTSWAP"] = "WAULTSWAP";
  DexProtocol2["COMETH"] = "COMETH";
  DexProtocol2["TROPICAL_SWAP"] = "TROPICAL_SWAP";
  DexProtocol2["MANTLESWAP"] = "MANTLESWAP";
  DexProtocol2["DTX_V1"] = "DTX_V1";
  DexProtocol2["TAIKOSWAP"] = "TAIKOSWAP";
  DexProtocol2["PASS"] = "PASS";
  DexProtocol2["NETSWAP"] = "NETSWAP";
  DexProtocol2["HERCULES_V2"] = "HERCULES_V2";
  DexProtocol2["HERMES"] = "HERMES";
  DexProtocol2["SPACEFI"] = "SPACEFI";
  DexProtocol2["ZKSWAP_V2"] = "ZKSWAP_V2";
  DexProtocol2["SWAPR_V1"] = "SWAPR_V1";
  DexProtocol2["HONEYSWAP"] = "HONEYSWAP";
  DexProtocol2["AXION_V2"] = "AXION_V2";
  DexProtocol2["DODO_V1"] = "DODO_V1";
  DexProtocol2["DODO_V2"] = "DODO_V2";
  DexProtocol2["WOO_FI"] = "WOO_FI";
  DexProtocol2["PANCAKE_STABLE"] = "PANCAKE_STABLE";
  DexProtocol2["FUSIONX_STABLE"] = "FUSIONX_STABLE";
  DexProtocol2["VELOCIMETER_VOLATILE"] = "VELOCIMETER_VOLATILE";
  DexProtocol2["VELOCIMETER_STABLE"] = "VELOCIMETER_STABLE";
  DexProtocol2["CLEOPATRA_V1_VOLATILE"] = "CLEOPATRA_V1_VOLATILE";
  DexProtocol2["CLEOPATRA_V1_STABLE"] = "CLEOPATRA_V1_STABLE";
  DexProtocol2["PHARAOH_V1_VOLATILE"] = "PHARAOH_V1_VOLATILE";
  DexProtocol2["PHARAOH_V1_STABLE"] = "PHARAOH_V1_STABLE";
  DexProtocol2["NILE_VOLATILE"] = "NILE_VOLATILE";
  DexProtocol2["NILE_STABLE"] = "NILE_STABLE";
  DexProtocol2["LYNEX_V1_VOLATILE"] = "LYNEX_V1_VOLATILE";
  DexProtocol2["LYNEX_V1_STABLE"] = "LYNEX_V1_STABLE";
  DexProtocol2["STRATUM_VOLATILE"] = "STRATUM_VOLATILE";
  DexProtocol2["STRATUM_STABLE"] = "STRATUM_STABLE";
  DexProtocol2["DYSTOPIA_VOLATILE"] = "DYSTOPIA_VOLATILE";
  DexProtocol2["DYSTOPIA_STABLE"] = "DYSTOPIA_STABLE";
  DexProtocol2["KODO_VOLATILE"] = "KODO_VOLATILE";
  DexProtocol2["KODO_STABLE"] = "KODO_STABLE";
  DexProtocol2["CRUST_V1_VOLATILE"] = "CRUST_V1_VOLATILE";
  DexProtocol2["CRUST_V1_STABLE"] = "CRUST_V1_STABLE";
  DexProtocol2["RAMSES_V1_VOLATILE"] = "RAMSES_V1_VOLATILE";
  DexProtocol2["RAMSES_V1_STABLE"] = "RAMSES_V1_STABLE";
  DexProtocol2["HERMES_VOLATILE"] = "HERMES_VOLATILE";
  DexProtocol2["HERMES_STABLE"] = "HERMES_STABLE";
  DexProtocol2["VELODROME_V1_VOLATILE"] = "VELODROME_V1_VOLATILE";
  DexProtocol2["VELODROME_V1_STABLE"] = "VELODROME_V1_STABLE";
  DexProtocol2["VELODROME_V2_VOLATILE"] = "VELODROME_V2_VOLATILE";
  DexProtocol2["VELODROME_V2_STABLE"] = "VELODROME_V2_STABLE";
  DexProtocol2["KOI_VOLATILE"] = "KOI_VOLATILE";
  DexProtocol2["KOI_STABLE"] = "KOI_STABLE";
  DexProtocol2["CAMELOT_V2_VOLATILE"] = "CAMELOT_V2_VOLATILE";
  DexProtocol2["CAMELOT_V2_STABLE"] = "CAMELOT_V2_STABLE";
  DexProtocol2["HERCULES_V2_VOLATILE"] = "HERCULES_V2_VOLATILE";
  DexProtocol2["HERCULES_V2_STABLE"] = "HERCULES_V2_STABLE";
  DexProtocol2["UNISWAP_V3"] = "UNISWAP_V3";
  DexProtocol2["SQUADSWAP_V3"] = "SQUADSWAP_V3";
  DexProtocol2["DACKIESWAP_V3"] = "DACKIESWAP_V3";
  DexProtocol2["WAGMI"] = "WAGMI";
  DexProtocol2["MAIA_V3"] = "MAIA_V3";
  DexProtocol2["ALIENBASE_V3"] = "ALIENBASE_V3";
  DexProtocol2["BASEX_V3"] = "BASEX_V3";
  DexProtocol2["KINETIX_V3"] = "KINETIX_V3";
  DexProtocol2["AERODROME_SLIPSTREAM"] = "AERODROME_SLIPSTREAM";
  DexProtocol2["PANCAKESWAP_V3"] = "PANCAKESWAP_V3";
  DexProtocol2["BISWAP_V3"] = "BISWAP_V3";
  DexProtocol2["FUSIONX_V3"] = "FUSIONX_V3";
  DexProtocol2["QUICKSWAP_V3"] = "QUICKSWAP_V3";
  DexProtocol2["SUSHISWAP_V3"] = "SUSHISWAP_V3";
  DexProtocol2["SOLIDLY_V3"] = "SOLIDLY_V3";
  DexProtocol2["IZUMI"] = "IZUMI";
  DexProtocol2["AGNI"] = "AGNI";
  DexProtocol2["SWAPSICLE"] = "SWAPSICLE";
  DexProtocol2["RETRO"] = "RETRO";
  DexProtocol2["METHLAB"] = "METHLAB";
  DexProtocol2["HENJIN"] = "HENJIN";
  DexProtocol2["CAMELOT"] = "CAMELOT";
  DexProtocol2["DTX"] = "DTX";
  DexProtocol2["CRUST"] = "CRUST";
  DexProtocol2["PANKO"] = "PANKO";
  DexProtocol2["SHADOW_CL"] = "SHADOW_CL";
  DexProtocol2["KOI_CL"] = "KOI_CL";
  DexProtocol2["ZKSWAP_V3"] = "ZKSWAP_V3";
  DexProtocol2["PHARAOH_CL"] = "PHARAOH_CL";
  DexProtocol2["UNAGI_V3"] = "UNAGI_V3";
  DexProtocol2["AXION_V3"] = "AXION_V3";
  DexProtocol2["CLEOPATRA"] = "CLEOPATRA";
  DexProtocol2["RAMSES_V2"] = "RAMSES_V2";
  DexProtocol2["NILE_CL"] = "NILE_CL";
  DexProtocol2["VELODROME_V3"] = "VELODROME_V3";
  DexProtocol2["CURVE_V1_CLASSIC"] = "CURVE_V1_CLASSIC";
  DexProtocol2["CURVE_NG"] = "CURVE_NG";
  DexProtocol2["CURVE_CRYPTO"] = "CURVE_CRYPTO";
  DexProtocol2["CURVE_STANDARD"] = "CURVE_STANDARD";
  DexProtocol2["CURVE_RECEIVE"] = "CURVE_RECEIVE";
  DexProtocol2["STRATUM_CURVE_STABLE"] = "STRATUM_CURVE_STABLE";
  DexProtocol2["STRATUM_CURVE"] = "STRATUM_CURVE";
  DexProtocol2["PANKO_STABLE"] = "PANKO_STABLE";
  DexProtocol2["KTX"] = "KTX";
  DexProtocol2["GMX"] = "GMX";
  DexProtocol2["TETHYS"] = "TETHYS";
  DexProtocol2["MERCHANT_MOE_LB"] = "MERCHANT_MOE_LB";
  DexProtocol2["TRADER_JOE_LB_V2"] = "TRADER_JOE_LB_V2";
  DexProtocol2["TRADER_JOE_LB_V21"] = "TRADER_JOE_LB_V21";
  DexProtocol2["TRADER_JOE_LB_V22"] = "TRADER_JOE_LB_V22";
  DexProtocol2["SYNC_BASE"] = "SYNC_BASE";
  DexProtocol2["SYNC_RYTHM"] = "SYNC_RYTHM";
  DexProtocol2["SYNC_STABLE"] = "SYNC_STABLE";
  DexProtocol2["RITSU_BASE"] = "RITSU_BASE";
  DexProtocol2["RITSU_RYTHM"] = "RITSU_RYTHM";
  DexProtocol2["RITSU_STABLE"] = "RITSU_STABLE";
  DexProtocol2["BALANCER_V2"] = "BALANCER_V2";
  DexProtocol2["SYMMETRIC"] = "SYMMETRIC";
  DexProtocol2["SWAAP"] = "SWAAP";
  DexProtocol2["MAVERICK_V2"] = "MAVERICK_V2";
  DexProtocol2["MIRA_VOLATILE"] = "MIRA_VOLATILE";
  DexProtocol2["MIRA_STABLE"] = "MIRA_STABLE";
  DexProtocol2["DIESEL_VOLATILE"] = "DIESEL_VOLATILE";
  DexProtocol2["DIESEL_STABLE"] = "DIESEL_STABLE";
  DexProtocol2["SHADOW_V2_VOLATILE"] = "SHADOW_V2_VOLATILE";
  DexProtocol2["SHADOW_V2_STABLE"] = "SHADOW_V2_STABLE";
  DexProtocol2["SWAPX_V2_VOLATILE"] = "SWAPX_V2_VOLATILE";
  DexProtocol2["SWAPX_V2_STABLE"] = "SWAPX_V2_STABLE";
  DexProtocol2["ZYBERSWAP"] = "ZYBERSWAP";
  DexProtocol2["SKULLSWAP"] = "SKULLSWAP";
  DexProtocol2["UBESWAP"] = "UBESWAP";
  DexProtocol2["LITX"] = "LITX";
  DexProtocol2["STELLASWAP"] = "STELLASWAP";
  DexProtocol2["LYNEX"] = "LYNEX";
  DexProtocol2["SWAP_BASED"] = "SWAP_BASED";
  DexProtocol2["SYNTHSWAP"] = "SYNTHSWAP";
  DexProtocol2["HERCULES"] = "HERCULES";
  DexProtocol2["KIM"] = "KIM";
  DexProtocol2["FENIX"] = "FENIX";
  DexProtocol2["BLADE"] = "BLADE";
  DexProtocol2["SILVER_SWAP"] = "SILVER_SWAP";
  DexProtocol2["HORIZON"] = "HORIZON";
  DexProtocol2["GLYPH"] = "GLYPH";
  DexProtocol2["SWAPX"] = "SWAPX";
  DexProtocol2["BULLA"] = "BULLA";
  DexProtocol2["SCRIBE"] = "SCRIBE";
  DexProtocol2["FIBONACCI"] = "FIBONACCI";
  DexProtocol2["VOLTAGE"] = "VOLTAGE";
  DexProtocol2["WASABEE"] = "WASABEE";
  DexProtocol2["HOLIVERSE"] = "HOLIVERSE";
  DexProtocol2["MOR_FI"] = "MOR_FI";
  DexProtocol2["ATLAS"] = "ATLAS";
  DexProtocol2["THENA"] = "THENA";
  DexProtocol2["VELOCIMETER"] = "VELOCIMETER";
  DexProtocol2["CLEOPATRA_V1"] = "CLEOPATRA_V1";
  DexProtocol2["STRATUM"] = "STRATUM";
  DexProtocol2["DYSTOPIA"] = "DYSTOPIA";
  DexProtocol2["KODO"] = "KODO";
  DexProtocol2["CRUST_V1"] = "CRUST_V1";
  DexProtocol2["RAMSES_V1"] = "RAMSES_V1";
  DexProtocol2["CAMELOT_V2"] = "CAMELOT_V2";
  DexProtocol2["MIRA"] = "MIRA";
  DexProtocol2["DIESEL"] = "DIESEL";
  DexProtocol2["SHADOW_V2"] = "SHADOW_V2";
  DexProtocol2["SWAPX_V2"] = "SWAPX_V2";
  DexProtocol2["VELODROME_V1"] = "VELODROME_V1";
  DexProtocol2["VELODROME_V2"] = "VELODROME_V2";
  DexProtocol2["LYNEX_V1"] = "LYNEX_V1";
  DexProtocol2["NILE"] = "NILE";
  DexProtocol2["PHARAOH_V1"] = "PHARAOH_V1";
  DexProtocol2["KOI"] = "KOI";
  return DexProtocol2;
})(DexProtocol || {});
var BALANCER_V2 = {
  vault: {
    [Chain.ETHEREUM_MAINNET]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.POLYGON_MAINNET]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.ARBITRUM_ONE]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.AVALANCHE_C_CHAIN]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.SONIC_MAINNET]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.GNOSIS]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.BASE]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.MODE]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.POLYGON_ZKEVM]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.OP_MAINNET]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.FRAXTAL]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    [Chain.FANTOM_OPERA]: "0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce"
  },
  forkId: "0"
};
var SWAAP = {
  vault: {
    [Chain.ETHEREUM_MAINNET]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.BASE]: "0x03C01Acae3D0173a93d819efDc832C7C4F153B06",
    [Chain.OP_MAINNET]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.ARBITRUM_ONE]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.POLYGON_MAINNET]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x03C01Acae3D0173a93d819efDc832C7C4F153B06",
    [Chain.SCROLL]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.AVALANCHE_C_CHAIN]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.LINEA]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.MANTLE]: "0xd315a9c38ec871068fec378e4ce78af528c76293",
    [Chain.MODE]: "0xd315a9c38ec871068fec378e4ce78af528c76293"
  },
  forkId: "1"
};
var SYMMETRIC = {
  vault: {
    [Chain.TAIKO_ALETHIA]: "0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD",
    [Chain.TELOS_EVM_MAINNET]: "0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD",
    [Chain.METER_MAINNET]: "0x913f21E596790aFC6AA45229E9ff8b7d0A473D5A"
  },
  forkId: "2"
};
var BALANCER_V2_FORKS = {
  [
    "BALANCER_V2"
    /* BALANCER_V2 */
  ]: BALANCER_V2,
  [
    "SYMMETRIC"
    /* SYMMETRIC */
  ]: SYMMETRIC,
  [
    "SWAAP"
    /* SWAAP */
  ]: SWAAP
};
var BALANCER_V3 = {
  vault: {
    [Chain.ETHEREUM_MAINNET]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.ARBITRUM_ONE]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.AVALANCHE_C_CHAIN]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.GNOSIS]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.BASE]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.SONIC_MAINNET]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.POLYGON_ZKEVM]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
    [Chain.OP_MAINNET]: "0xbA1333333333a1BA1108E8412f11850A5C319bA9"
  },
  forkId: "0"
};
var BALANCER_V3_FORKS = {
  [
    "BALANCER_V3"
    /* BALANCER_V3 */
  ]: BALANCER_V3
};
var uniswapV2InitHash = "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
var pancakeV2CodeHash = "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5";
var uniV2CallbackSelector = "0x10d1e85c00000000000000000000000000000000000000000000000000000000";
var pancakeV2CallbackSelector = "0x8480081200000000000000000000000000000000000000000000000000000000";
var solidlyV2CallbackSelector = "0x9a7bff7900000000000000000000000000000000000000000000000000000000";
var UNISWAP_V2 = {
  factories: {
    [Chain.ETHEREUM_MAINNET]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    [Chain.ARBITRUM_ONE]: "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9",
    [Chain.BASE]: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
    [Chain.AVALANCHE_C_CHAIN]: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
    [Chain.OP_MAINNET]: "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf",
    [Chain.POLYGON_MAINNET]: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
    [Chain.BLAST]: "0x5C346464d33F90bABaf70dB6388507CC889C1070",
    [Chain.ZORA]: "0x0F797dC7efaEA995bB916f268D919d0a1950eE3C",
    [Chain.WORLD_CHAIN]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    // [Chain.SCROLL]: "",
    // [Chain.LINEA]: "",
    // [Chain.MANTLE]: "",
    // [Chain.TAIKO_ALETHIA]: "",
    // [Chain.GNOSIS]: "",
    // [Chain.SONIC_MAINNET]: "",
    // [Chain.INK]: "",
    // [Chain.HEMI_NETWORK]: ""
  },
  codeHash: { default: uniswapV2InitHash },
  callbackSelector: uniV2CallbackSelector,
  forkId: "0",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var PANCAKE_V2 = {
  factories: {
    [Chain.ETHEREUM_MAINNET]: "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362",
    [Chain.ARBITRUM_ONE]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    [Chain.BASE]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    [Chain.LINEA]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    [Chain.OPBNB_MAINNET]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    [Chain.ZKSYNC_MAINNET]: "0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d",
    [Chain.POLYGON_ZKEVM]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E"
    // [Chain.POLYGON_MAINNET]: "",
    // [Chain.BLAST]: "",
    // [Chain.ZORA]: "",
    // [Chain.WORLD_CHAIN]: "",
    // [Chain.SCROLL]: "",
    // [Chain.LINEA]: "",
    // [Chain.MANTLE]: "",
    // [Chain.TAIKO_ALETHIA]: "",
    // [Chain.GNOSIS]: "",
    // [Chain.SONIC_MAINNET]: "",
    // [Chain.INK]: "",
    // [Chain.HEMI_NETWORK]: ""
  },
  codeHash: { default: pancakeV2CodeHash },
  callbackSelector: pancakeV2CallbackSelector,
  forkId: "0",
  fee: 2500n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var SUSHI_V2 = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.ARBITRUM_NOVA]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.AVALANCHE_C_CHAIN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.BASE]: "0x71524B4f93c58fcbF659783284E38825f0622859",
    [Chain.BLAST]: "0x42Fa929fc636e657AC568C0b5Cf38E203b67aC2b",
    [Chain.BOBA_NETWORK]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // [Chain.BOBA_AVAX]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.BOBA_BNB_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // [Chain.BSC_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.BITTORRENT_CHAIN_MAINNET]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    [Chain.CELO_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.CORE_BLOCKCHAIN_MAINNET]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    [Chain.ETHEREUM_MAINNET]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
    [Chain.FANTOM_OPERA]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.FILECOIN_MAINNET]: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE",
    // [Chain.FUJI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.FUSE_MAINNET]: "0x43eA90e2b786728520e4f930d2A71a477BF2737C",
    // [Chain.GOERLI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.HAQQ_NETWORK]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    [Chain.HARMONY_MAINNET_SHARD_0]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // [Chain.HARMONY_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.HUOBI_ECO_CHAIN_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // [Chain.HECO_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.KAVA]: "0xD408a20f1213286fB3158a2bfBf5bFfAca8bF269",
    // [Chain.KOVAN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.LINEA]: "0xFbc12984689e5f15626Bad03Ad60160Fe98B303C",
    // [Chain.LOCALHOST]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    [Chain.POLYGON_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x580ED43F3BBa06555785C81c2957efCCa71f7483",
    [Chain.MOONBEAM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.MOONRIVER]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // [Chain.MUMBAI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.OKXCHAIN_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    // [Chain.OKEX_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.OP_MAINNET]: "0xFbc12984689e5f15626Bad03Ad60160Fe98B303C",
    [Chain.PALM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.POLYGON_ZKEVM]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    // [Chain.RINKEBY]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.ROOTSTOCK_MAINNET]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    // [Chain.ROPSTEN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.SCROLL]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    // [Chain.SEPOLIA]: "0x734583f62Bb6ACe3c9bA9bd5A53143CA2Ce8C55A",
    [Chain.SKALE_EUROPA_HUB]: "0x1aaF6eB4F85F8775400C1B10E6BbbD98b2FF8483",
    [Chain.TELOS_EVM_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.THUNDERCORE_MAINNET]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    [Chain.GNOSIS]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.ZETACHAIN_MAINNET]: "0x33d91116e0370970444B0281AB117e161fEbFcdD",
    [Chain.HEMI_NETWORK]: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE"
  },
  codeHash: { default: uniswapV2InitHash },
  callbackSelector: uniV2CallbackSelector,
  forkId: "1",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var PASS = {
  factories: {
    [Chain.HEMI_NETWORK]: "0x242c913Ff5FE010430A709baab977e88435b7EBF"
  },
  codeHash: { default: "0xd040a901beef1fe03d5f83aff62cc341aa8fa949dcdaa516b1adcfae94ada0db" },
  callbackSelector: uniV2CallbackSelector,
  forkId: "50",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var UBESWAP = {
  factories: {
    [Chain.CELO_MAINNET]: "0x62d5b84bE28a183aBB507E125B384122D2C25fAE"
  },
  codeHash: { default: "0xb3b8ff62960acea3a88039ebcf80699f15786f1b17cebd82802f7375827a339c" },
  callbackSelector: uniV2CallbackSelector,
  forkId: "10",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var BISWAP_V2 = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x858E3312ed3A876947EA49d572A7C42DE08af7EE"
  },
  codeHash: { default: "0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf" },
  callbackSelector: "0x5b3bc4fe00000000000000000000000000000000000000000000000000000000",
  // BiswapCall
  forkId: "0",
  fee: 2500n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var SHADOW_V2 = {
  factories: {
    [Chain.SONIC_MAINNET]: "0x2dA25E7446A70D7be65fd4c053948BEcAA6374c8"
  },
  codeHash: { default: "0x4ed7aeec7c0286cad1e282dee1c391719fc17fe923b04fb0775731e413ed3554" },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "131",
  fee: 5000n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var KODO = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x535E02960574d8155596a73c7Ad66e87e37Eb6Bc"
  },
  codeHash: { default: "0x24364b5d47cc9af524ff2ae89d98c1c10f4a388556279eecb00622b5d727c99a" },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "132",
  fee: 2000n,
  feeStable: 200n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var VELOCIMETER = {
  factories: {
    [Chain.MANTLE]: "0x99F9a4A96549342546f9DAE5B2738EDDcD43Bf4C"
  },
  codeHash: { default: "0x0ccd005ee58d5fb11632ef5c2e0866256b240965c62c8e990c0f84a97f311879" },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "133",
  fee: 2500n,
  feeStable: 300n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var DYSTOPIA = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x1d21Db6cde1b18c7E47B0F7F42f4b3F68b9beeC9"
  },
  codeHash: { default: "0x009bce6d7eb00d3d075e5bd9851068137f44bba159f1cde806a268e20baaf2e8" },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "134",
  fee: 500n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var RAMSES_V1 = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0xAAA20D08e59F6561f242b08513D36266C5A29415"
  },
  codeHash: {
    [Chain.ARBITRUM_ONE]: "OVERRIDE"
    /* OVERRIDE */
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "135",
  fee: 2500n,
  feeStable: 500n,
  forkType: {
    default: "RamsesV1"
    /* RamsesV1 */
  }
};
var CLEOPATRA_V1 = {
  factories: {
    [Chain.MANTLE]: "0xAAA16c016BF556fcD620328f0759252E29b1AB57"
  },
  codeHash: {
    [Chain.MANTLE]: "0xbf2404274de2b11f05e5aebd49e508de933034cb5fa2d0ac3de8cbd4bcef47dc"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "135",
  fee: 2500n,
  feeStable: 500n,
  forkType: {
    default: "RamsesV1"
    /* RamsesV1 */
  }
};
var PHARAOH_V1 = {
  factories: {
    [Chain.AVALANCHE_C_CHAIN]: "0xAAA16c016BF556fcD620328f0759252E29b1AB57"
  },
  codeHash: {
    [Chain.AVALANCHE_C_CHAIN]: "0xbf2404274de2b11f05e5aebd49e508de933034cb5fa2d0ac3de8cbd4bcef47dc"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "135",
  fee: 5000n,
  feeStable: 500n,
  forkType: {
    default: "RamsesV1"
    /* RamsesV1 */
  }
};
var CAMELOT_V2 = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0x6EcCab422D763aC031210895C81787E87B43A652"
  },
  codeHash: { default: "0xa856464ae65f7619087bc369daaf7e387dae1e5af69cfa7935850ebf754b04c1" },
  callbackSelector: uniV2CallbackSelector,
  forkId: "130",
  fee: 3000n,
  feeStable: 500n,
  forkType: {
    default: "Camelot"
    /* Camelot */
  }
};
var SWAPX_V2 = {
  factories: {
    [Chain.SONIC_MAINNET]: "0x05c1be79d3aC21Cc4B727eeD58C9B2fF757F5663"
  },
  codeHash: { default: "0x6c45999f36731ff6ab43e943fca4b5a700786bbb202116cf6633b32039161e05" },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "136",
  fee: 10000n,
  feeStable: 100n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var METROPOLIS_V2 = {
  factories: {
    [Chain.SONIC_MAINNET]: "0x1570300e9cFEC66c9Fb0C8bc14366C86EB170Ad0"
  },
  codeHash: { default: "0xb174fb9703cd825ac38ca3cf781a2750d5ee57f4268806e0bca9bcd3d74b67b5" },
  callbackSelector: "0xd1f6317800000000000000000000000000000000000000000000000000000000",
  // doCall
  forkId: "11",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var APESWAP_V2 = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0xCf083Be4164828f00cAE704EC15a36D711491284",
    [Chain.ARBITRUM_ONE]: "0xCf083Be4164828f00cAE704EC15a36D711491284"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0x511f0f358fe530cda0859ec20becf391718fdf5a329be02f4c95361f3d6a42d8",
    [Chain.ARBITRUM_ONE]: "0xae7373e804a043c4c08107a81def627eeb3792e211fb4711fcfe32f0e4c45fd5"
  },
  callbackSelector: "0xbecda36300000000000000000000000000000000000000000000000000000000",
  // apeCall 
  forkId: "12",
  fee: 2000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var SWAPR_V1 = {
  factories: {
    [Chain.GNOSIS]: "0x5D48C95AdfFD4B40c1AAADc4e08fc44117E02179"
  },
  codeHash: {
    [Chain.GNOSIS]: "0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776"
  },
  callbackSelector: "0xb527c5d000000000000000000000000000000000000000000000000000000000",
  // DXswapCall 
  forkId: "0",
  fee: 2500n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var HONEYSWAP = {
  factories: {
    [Chain.GNOSIS]: "0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7"
  },
  codeHash: {
    [Chain.GNOSIS]: "0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93"
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "19",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var WAULTSWAP_V2 = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0xa98ea6356A316b44Bf710D5f9b6b4eA0081409Ef"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0x1cdc2246d318ab84d8bc7ae2a3d81c235f3db4e113f4c6fdc1e2211a9291be47"
  },
  callbackSelector: "0x485f399400000000000000000000000000000000000000000000000000000000",
  // waultSwapCall 
  forkId: "13",
  fee: 2000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var DFYN = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3"
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "14",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var POLYCAT = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x477Ce834Ae6b7aB003cCe4BC4d8697763FF456FA"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0x3cad6f9e70e13835b4f07e5dd475f25a109450b22811d0437da51e66c161255a"
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "15",
  fee: 2400n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var COMETH = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x800b052609c355cA8103E06F022aA30647eAd60a"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0x499154cad90a3563f914a25c3710ed01b9a43b8471a35ba8a66a056f37638542"
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "16",
  fee: 5000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var QUICKSWAP_V2 = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "3",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var MERCHANT_MOE = {
  factories: {
    [Chain.MANTLE]: "0x5bEf015CA9424A7C07B68490616a4C1F094BEdEc"
  },
  codeHash: {
    [Chain.MANTLE]: "OVERRIDE"
    /* OVERRIDE */
  },
  implementation: {
    [Chain.MANTLE]: "0x08477e01A19d44C31E4C11Dc2aC86E3BBE69c28B"
  },
  callbackSelector: "0xba85410f00000000000000000000000000000000000000000000000000000000",
  // moeCall
  forkId: "0",
  fee: 3000n,
  forkType: {
    default: "Moe"
    /* Moe */
  }
};
var TAIKOSWAP = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x7C43adAfc2337BaA16AA2876F9DE8Da5B3720FdB"
  },
  codeHash: {
    [Chain.TAIKO_ALETHIA]: "0xf134c874b39e61378a3f19b6f15a0e83c6916c54524901806f3e1ca3da7b2243"
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var MANTLESWAP = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x7C43adAfc2337BaA16AA2876F9DE8Da5B3720FdB"
  },
  codeHash: {
    [Chain.TAIKO_ALETHIA]: "0x248aa3d53dff9c2e464d6feb0fae0ee52adebff933dd9c2ee6744356b46cf848"
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 2500n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var TROPICAL_SWAP = {
  factories: {
    [Chain.MANTLE]: "0x5b54d3610ec3f7fb1d5b42ccf4df0fb4e136f249"
  },
  codeHash: {
    [Chain.MANTLE]: "0x321aea434584ceee22f77514cbdc4c631d3feba4b643c492f852c922a409ed1e"
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 2000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var CRUST_V1 = {
  factories: {
    [Chain.MANTLE]: "0x62DbCa39067f99C9D788a253cB325c6BA50e51cE"
  },
  codeHash: {
    [Chain.MANTLE]: "0x7bc86d3461c6b25a75205e3bcd8e9815e8477f2af410ccbe931d784a528143fd"
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 2000n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var STRATUM = {
  factories: {
    [Chain.MANTLE]: "0x061FFE84B0F9E1669A6bf24548E5390DBf1e03b2"
  },
  codeHash: {
    [Chain.MANTLE]: "0xeb675862e19b0846fd47f7db0e8f2bf8f8da0dcd0c9aa75603248566f3faa805"
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 2500n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var FUSIONX_V2 = {
  factories: {
    [Chain.MANTLE]: "0xE5020961fA51ffd3662CDf307dEf18F9a87Cce7c"
  },
  codeHash: {
    [Chain.MANTLE]: "0x58c684aeb03fe49c8a3080db88e425fae262c5ef5bf0e8acffc0526c6e3c03a0"
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 2000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var NETSWAP = {
  factories: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x70f51d68D16e8f9e418441280342BD43AC9Dff9f"
  },
  codeHash: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x966d65068a6a30f10fd1fa814258637a34e059081d79daa94f3e2b6cec48e810"
  },
  callbackSelector: "0x924ba9cc00000000000000000000000000000000000000000000000000000000",
  // netswapCall
  forkId: "0",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var AXION_V2 = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x8a8865fa5fB7C8360E5a6d8Aa27F7Ca1b9E55443"
  },
  codeHash: {
    [Chain.TAIKO_ALETHIA]: "0x4c961aaf675d77e6066d0b33ea70d966866f9c0aa2a94c0696efa27ac84771d5"
  },
  callbackSelector: "0xda477ab500000000000000000000000000000000000000000000000000000000",
  // AxionCall
  forkId: "0",
  fee: 2000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var HERCULES = {
  factories: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0xF38E7c7f8eA779e8A193B61f9155E6650CbAE095"
  },
  codeHash: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0xa856464ae65f7619087bc369daaf7e387dae1e5af69cfa7935850ebf754b04c1"
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "130",
  fee: 3000n,
  feeStable: 500n,
  forkType: {
    default: "Camelot"
    /* Camelot */
  }
};
var HERMES = {
  factories: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x633a093C9e94f64500FC8fCBB48e90dd52F6668F"
  },
  codeHash: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x1206c53c96c9926d750268b77c1897f0b6035ff853c3ba6088623ed7df249367"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "136",
  fee: 100n,
  feeStable: 100n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var VELODROME_V2 = {
  factories: {
    [Chain.OP_MAINNET]: "0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a",
    [Chain.SWELLCHAIN]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.LISK]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.INK]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.FRAXTAL]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.BOB]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.SONEIUM]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.MODE]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
    [Chain.UNICHAIN]: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0"
  },
  codeHash: {
    // keccak256(hex"363d3d373d3d3d363d73${implementation}5af43d82803e903d91602b57fd5bf3")
    [Chain.OP_MAINNET]: "0xc0629f1c7daa09624e54d4f711ba99922a844907cce02997176399e4cc7e8fcf",
    [Chain.SWELLCHAIN]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.LISK]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.INK]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.FRAXTAL]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.BOB]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.SONEIUM]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.MODE]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d",
    [Chain.UNICHAIN]: "0x558be7ee0c63546b31d0773eee1d90451bd76a0167bb89653722a2bd677c002d"
  },
  implementation: {
    [Chain.OP_MAINNET]: "0x95885Af5492195F0754bE71AD1545Fe81364E531",
    [Chain.SWELLCHAIN]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.LISK]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.INK]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.FRAXTAL]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.BOB]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.SONEIUM]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.UNICHAIN]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C",
    [Chain.MODE]: "0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "138",
  fee: 3000n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var VELODROME_V1 = {
  factories: {
    [Chain.OP_MAINNET]: "0x25CbdDb98b35ab1FF77413456B31EC81A6B6B746"
  },
  codeHash: {
    [Chain.OP_MAINNET]: "0xc1ac28b1c4ebe53c0cff67bab5878c4eb68759bb1e9f73977cd266b247d149f0"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "137",
  fee: 3000n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var LYNEX_V1 = {
  factories: {
    [Chain.LINEA]: "0xBc7695Fd00E3b32D08124b7a4287493aEE99f9ee"
  },
  codeHash: {
    [Chain.LINEA]: "0xf40e8808230a29863f9f7f99beb90d28bca2c60094e78d93cca67f746dbfd142"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "139",
  fee: 2500n,
  feeStable: 100n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var NILE = {
  factories: {
    [Chain.LINEA]: "0xAAA16c016BF556fcD620328f0759252E29b1AB57"
  },
  codeHash: {
    [Chain.LINEA]: "0xbf2404274de2b11f05e5aebd49e508de933034cb5fa2d0ac3de8cbd4bcef47dc"
  },
  callbackSelector: solidlyV2CallbackSelector,
  forkId: "140",
  fee: 5000n,
  feeStable: 500n,
  forkType: {
    default: "RamsesV1"
    /* RamsesV1 */
  }
};
var KOI = {
  factories: {
    [Chain.ZKSYNC_MAINNET]: "0x40be1cBa6C5B47cDF9da7f963B6F761F4C60627D"
  },
  codeHash: {
    [Chain.ZKSYNC_MAINNET]: "0x95d5c05820d58f1c8cc736b47fe10a29ddcd2cf73a0d842e8537b9fe510fc618"
  },
  callbackSelector: "0x5426813c00000000000000000000000000000000000000000000000000000000",
  // muteswitchCall
  forkId: "132",
  fee: 8000n,
  feeStable: 100n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var TRADER_JOE_V1 = {
  factories: {
    [Chain.AVALANCHE_C_CHAIN]: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10"
  },
  codeHash: {
    [Chain.AVALANCHE_C_CHAIN]: "0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91"
  },
  callbackSelector: "0xee22dd8700000000000000000000000000000000000000000000000000000000",
  // joe Call
  forkId: "0",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var ZKSWAP_V2 = {
  factories: {
    [Chain.ZKSYNC_MAINNET]: "0x3a76e377ED58c8731F9DF3A36155942438744Ce3"
  },
  codeHash: {
    [Chain.ZKSYNC_MAINNET]: "OVERRIDE"
    /* OVERRIDE */
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "17",
  fee: 2500n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var SPACEFI = {
  factories: {
    [Chain.ZKSYNC_MAINNET]: "0x0700Fb51560CfC8F896B2c812499D17c5B0bF6A7"
  },
  codeHash: {
    // probably needs manual checks
    [Chain.ZKSYNC_MAINNET]: "0xf8d3c7145cbf55d3e34fcc9bdce8aa326ddf5f829c712119bb566bf56759e4dd"
    // DexValidation.OVERRIDE,
  },
  callbackSelector: uniV2CallbackSelector,
  forkId: "18",
  fee: 3000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var SQUADSWAP_V2 = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x918Adf1f2C03b244823Cd712E010B6e3CD653DbA",
    [Chain.ARBITRUM_ONE]: "0xba34aA640b8Be02A439221BCbea1f48c1035EEF9",
    [Chain.BASE]: "0xba34aA640b8Be02A439221BCbea1f48c1035EEF9",
    [Chain.BLAST]: "0x4B599f3425D54AfBf94bFD41EA9931fF92AD6551",
    [Chain.POLYGON_MAINNET]: "0xEE8F37D490CB7Ea1dae7d080c5738894731299f0",
    [Chain.OP_MAINNET]: "0xba34aA640b8Be02A439221BCbea1f48c1035EEF9"
  },
  codeHash: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x666b17e0f0313ce8c608a4761ae7fd0e1c936c7c63eb833ac540370647c0efdb",
    [Chain.ARBITRUM_ONE]: "0x98859e91a2d7077a5647fc52bfa56461f1be3991cfafdee3a968bf5d9a947f22",
    [Chain.BASE]: "0x98859e91a2d7077a5647fc52bfa56461f1be3991cfafdee3a968bf5d9a947f22",
    [Chain.BLAST]: "0x58c2c3390cddef0a17aed31cf6b51cc4b11e96866b8b16a613fc7999daefb24e",
    [Chain.POLYGON_MAINNET]: "0x98859e91a2d7077a5647fc52bfa56461f1be3991cfafdee3a968bf5d9a947f22",
    [Chain.OP_MAINNET]: "0x98859e91a2d7077a5647fc52bfa56461f1be3991cfafdee3a968bf5d9a947f22"
  },
  forkId: "0",
  callbackSelector: "0xa691a9c900000000000000000000000000000000000000000000000000000000",
  // squadswapCall
  fee: 2000n,
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var MIRA_FUEL = {
  factories: {
    [Chain.FUEL]: "0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7"
  },
  codeHash: {
    [Chain.FUEL]: "EXCLUDE"
    /* EXCLUDE */
  },
  callbackSelector: "EXCLUDE",
  forkId: "0",
  fee: 3000n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var DIESEL_FUEL = {
  factories: {
    [Chain.FUEL]: "0x7c293b054938bedca41354203be4c08aec2c3466412cac803f4ad62abf22e476"
  },
  codeHash: {
    [Chain.FUEL]: "EXCLUDE"
    /* EXCLUDE */
  },
  callbackSelector: "EXCLUDE",
  forkId: "1",
  fee: 3000n,
  feeStable: 500n,
  forkType: {
    default: "Solidly"
    /* Solidly */
  }
};
var UNISWAP_V2_FORKS = {
  [
    "UNISWAP_V2"
    /* UNISWAP_V2 */
  ]: UNISWAP_V2,
  [
    "SUSHISWAP_V2"
    /* SUSHISWAP_V2 */
  ]: SUSHI_V2,
  [
    "PANCAKESWAP_V2"
    /* PANCAKESWAP_V2 */
  ]: PANCAKE_V2,
  [
    "PASS"
    /* PASS */
  ]: PASS,
  [
    "BISWAP_V2"
    /* BISWAP_V2 */
  ]: BISWAP_V2,
  [
    "UBESWAP_V2"
    /* UBESWAP_V2 */
  ]: UBESWAP,
  [
    "METROPOLIS_V2"
    /* METROPOLIS_V2 */
  ]: METROPOLIS_V2,
  [
    "APESWAP"
    /* APESWAP */
  ]: APESWAP_V2,
  [
    "WAULTSWAP"
    /* WAULTSWAP */
  ]: WAULTSWAP_V2,
  [
    "DFYN"
    /* DFYN */
  ]: DFYN,
  [
    "POLYCAT"
    /* POLYCAT */
  ]: POLYCAT,
  [
    "COMETH"
    /* COMETH */
  ]: COMETH,
  [
    "QUICKSWAP_V2"
    /* QUICKSWAP_V2 */
  ]: QUICKSWAP_V2,
  [
    "SQUADSWAP_V2"
    /* SQUADSWAP_V2 */
  ]: SQUADSWAP_V2,
  [
    "MERCHANT_MOE"
    /* MERCHANT_MOE */
  ]: MERCHANT_MOE,
  [
    "FUSIONX_V2"
    /* FUSIONX_V2 */
  ]: FUSIONX_V2,
  [
    "TAIKOSWAP"
    /* TAIKOSWAP */
  ]: TAIKOSWAP,
  [
    "TROPICAL_SWAP"
    /* TROPICAL_SWAP */
  ]: TROPICAL_SWAP,
  [
    "MANTLESWAP"
    /* MANTLESWAP */
  ]: MANTLESWAP,
  [
    "TRADER_JOE_V1"
    /* TRADER_JOE_V1 */
  ]: TRADER_JOE_V1,
  [
    "LYNEX_V1"
    /* LYNEX_V1 */
  ]: LYNEX_V1,
  [
    "NILE"
    /* NILE */
  ]: NILE,
  [
    "ZKSWAP_V2"
    /* ZKSWAP_V2 */
  ]: ZKSWAP_V2,
  [
    "SPACEFI"
    /* SPACEFI */
  ]: SPACEFI,
  [
    "SWAPR_V1"
    /* SWAPR_V1 */
  ]: SWAPR_V1,
  [
    "HONEYSWAP"
    /* HONEYSWAP */
  ]: HONEYSWAP,
  [
    "AXION_V2"
    /* AXION_V2 */
  ]: AXION_V2,
  // solidlies go without the stable & volatile
  [
    "SHADOW_V2"
    /* SHADOW_V2 */
  ]: SHADOW_V2,
  [
    "CAMELOT_V2"
    /* CAMELOT_V2 */
  ]: CAMELOT_V2,
  [
    "VELOCIMETER"
    /* VELOCIMETER */
  ]: VELOCIMETER,
  [
    "DYSTOPIA"
    /* DYSTOPIA */
  ]: DYSTOPIA,
  [
    "RAMSES_V1"
    /* RAMSES_V1 */
  ]: RAMSES_V1,
  [
    "PHARAOH_V1"
    /* PHARAOH_V1 */
  ]: PHARAOH_V1,
  [
    "CLEOPATRA_V1"
    /* CLEOPATRA_V1 */
  ]: CLEOPATRA_V1,
  [
    "KODO"
    /* KODO */
  ]: KODO,
  [
    "STRATUM"
    /* STRATUM */
  ]: STRATUM,
  [
    "SWAPX_V2"
    /* SWAPX_V2 */
  ]: SWAPX_V2,
  [
    "CRUST_V1"
    /* CRUST_V1 */
  ]: CRUST_V1,
  [
    "HERMES"
    /* HERMES */
  ]: HERMES,
  [
    "HERCULES_V2"
    /* HERCULES_V2 */
  ]: HERCULES,
  [
    "NETSWAP"
    /* NETSWAP */
  ]: NETSWAP,
  [
    "VELODROME_V1"
    /* VELODROME_V1 */
  ]: VELODROME_V1,
  [
    "VELODROME_V2"
    /* VELODROME_V2 */
  ]: VELODROME_V2,
  [
    "KOI"
    /* KOI */
  ]: KOI,
  // fuel
  [
    "MIRA"
    /* MIRA */
  ]: MIRA_FUEL,
  [
    "DIESEL"
    /* DIESEL */
  ]: DIESEL_FUEL
};
var uniswapV3InitHash = "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";
var uniswapV3CallbackSelector = "0xfa461e3300000000000000000000000000000000000000000000000000000000";
var pancakeV3CallbackSelector = "0x23a69e7500000000000000000000000000000000000000000000000000000000";
var algebraV3CallbackSelector = "0x2c8958f600000000000000000000000000000000000000000000000000000000";
var ramsesV2CallbackSelector = "0x654b648700000000000000000000000000000000000000000000000000000000";
var UNISWAP_V3 = {
  factories: {
    [Chain.ETHEREUM_MAINNET]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    [Chain.BASE]: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
    [Chain.AVALANCHE_C_CHAIN]: "0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD",
    [Chain.BLAST]: "0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd",
    [Chain.SCROLL]: "0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919",
    [Chain.LINEA]: "0x31FAfd4889FA1269F7a13A66eE0fB458f27D72A9",
    [Chain.MANTLE]: "0x0d922Fb1Bc191F64970ac40376643808b4B74Df9",
    [Chain.TAIKO_ALETHIA]: "0x75FC67473A91335B5b8F8821277262a13B38c9b3",
    [Chain.WORLD_CHAIN]: "0x7a5028BDa40e7B173C278C5342087826455ea25a",
    [Chain.GNOSIS]: "0xe32F7dD7e3f098D518ff19A22d5f028e076489B1",
    [Chain.SONIC_MAINNET]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
    [Chain.INK]: "0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424",
    [Chain.HEMI_NETWORK]: "0x346239972d1fa486FC4a521031BC81bFB7D6e8a4",
    [Chain.OP_MAINNET]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    [Chain.ARBITRUM_ONE]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    [Chain.POLYGON_MAINNET]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    [Chain.CELO_MAINNET]: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc",
    [Chain.ZKSYNC_MAINNET]: "0x8FdA5a7a8dCA67BBcDd10F02Fa0649A937215422",
    [Chain.BOBA_NETWORK]: "0xFFCd7Aed9C627E82A765c3247d562239507f6f1B",
    [Chain.POLYGON_ZKEVM]: "0xff83c3c800Fec21de45C5Ec30B69ddd5Ee60DFC2",
    [Chain.MOONBEAM]: "0x28f1158795A3585CaAA3cD6469CD65382b89BB70",
    [Chain.FILECOIN_MAINNET]: "0xB4C47eD546Fc31E26470a186eC2C5F19eF09BA41",
    [Chain.ROOTSTOCK_MAINNET]: "0xaF37EC98A00FD63689CF3060BF3B6784E00caD82",
    [Chain.ZORA]: "0x7145F8aeef1f6510E92164038E1B6F8cB2c42Cbb",
    [Chain.SEI_NETWORK]: "0x75FC67473A91335B5b8F8821277262a13B38c9b3",
    [Chain.MANTA_PACIFIC_MAINNET]: "0x06D830e15081f65923674268121FF57Cc54e4e23",
    [Chain.REDSTONE]: "0xece75613Aa9b1680f0421E5B2eF376DF68aa83Bb",
    [Chain.LISK]: "0x0d922Fb1Bc191F64970ac40376643808b4B74Df9",
    [Chain.BOB]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
    // [Chain.ZERO]: "0xA1160e73B63F322ae88cC2d8E700833e71D0b2a1",
    [Chain.METAL_L2]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
    [Chain.CYBER_MAINNET]: "0x9701158fcF072c6852FD83B54D237e0cf5910C08",
    [Chain.SAGA]: "0x454050C4c9190390981Ac4b8d5AFcd7aC65eEffa",
    [Chain.CORN]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
    [Chain.SHAPE]: "0xeCf9288395797Da137f663a7DD0F0CDF918776F8",
    [Chain.ABSTRACT]: "0xA1160e73B63F322ae88cC2d8E700833e71D0b2a1",
    [Chain.TELOS_EVM_MAINNET]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
    [Chain.LIGHTLINK_PHOENIX_MAINNET]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
    [Chain.GOAT_NETWORK]: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D"
  },
  codeHash: { default: uniswapV3InitHash },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "0",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var SUSHISWAP_V3 = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e",
    [Chain.ARBITRUM_NOVA]: "0xaa26771d497814E81D305c511Efbb3ceD90BF5bd",
    [Chain.OP_MAINNET]: "0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0",
    [Chain.AVALANCHE_C_CHAIN]: "0x3e603C14aF37EBdaD31709C4f848Fc6aD5BEc715",
    [Chain.BASE]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.BLAST]: "0x7680D4B43f3d1d54d6cfEeB2169463bFa7a6cf0d",
    [Chain.BOBA_NETWORK]: "0x0BE808376Ecb75a5CF9bB6D237d16cd37893d904",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x126555dd55a39328F69400d6aE4F782Bd4C34ABb",
    [Chain.BITTORRENT_CHAIN_MAINNET]: "0xBBDe1d67297329148Fe1ED5e6B00114842728e65",
    [Chain.CELO_MAINNET]: "0x93395129bd3fcf49d95730D3C2737c17990fF328",
    [Chain.CORE_BLOCKCHAIN_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.ETHEREUM_MAINNET]: "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F",
    [Chain.FANTOM_OPERA]: "0x7770978eED668a3ba661d51a773d3a992Fc9DDCB",
    [Chain.FILECOIN_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.FUSE_MAINNET]: "0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa",
    [Chain.GNOSIS]: "0xf78031CBCA409F2FB6876BDFDBc1b2df24cF9bEf",
    [Chain.HAQQ_NETWORK]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.KAVA]: "0x1e9B24073183d5c6B7aE5FB4b8f0b1dd83FDC77a",
    [Chain.LINEA]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x145d82bCa93cCa2AE057D1c6f26245d1b9522E6F",
    [Chain.MOONBEAM]: "0x2ecd58F51819E8F8BA08A650BEA04Fc0DEa1d523",
    [Chain.MOONRIVER]: "0x2F255d3f3C0A3726c6c99E74566c4b18E36E3ce6",
    [Chain.OPBNB_MAINNET]: "0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0",
    [Chain.POLYGON_MAINNET]: "0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2",
    [Chain.POLYGON_ZKEVM]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    [Chain.ROOTSTOCK_MAINNET]: "0x46B3fDF7b5CDe91Ac049936bF0bDb12c5d22202e",
    [Chain.SCROLL]: "0x46B3fDF7b5CDe91Ac049936bF0bDb12c5d22202e",
    [Chain.SKALE_EUROPA_HUB]: "0x51d15889b66A2c919dBbD624d53B47a9E8feC4bB",
    [Chain.THUNDERCORE_MAINNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    [Chain.ZETACHAIN_MAINNET]: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
    [Chain.HEMI_NETWORK]: "0xCdBCd51a5E8728E0AF4895ce5771b7d17fF71959"
  },
  codeHash: {
    default: uniswapV3InitHash,
    [Chain.BLAST]: "0x8e13daee7f5a62e37e71bf852bcd44e7d16b90617ed2b17c24c2ee62411c5bae"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "1",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var solidlyV3Factory = "0x70Fe4a44EA505cFa3A57b95cF2862D4fd5F0f687";
var solidlyV3InitHash = "0xe9b68c5f77858eecac2e651646e208175e9b1359d68d0e14fc69f8c54e5010bf";
var SOLIDLY_V3 = {
  factories: {
    [Chain.ETHEREUM_MAINNET]: solidlyV3Factory,
    [Chain.BASE]: solidlyV3Factory,
    [Chain.SONIC_MAINNET]: "0x777fAca731b17E8847eBF175c94DbE9d81A8f630"
  },
  codeHash: {
    default: solidlyV3InitHash
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "2",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var aerodromeInitHash = "0xffb9af9ea6d9e39da47392ecc7055277b9915b8bfc9f83f105821b7791a6ae30";
var AERODROME_SLIPSTREAM = {
  factories: {
    [Chain.BASE]: "0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A"
  },
  codeHash: { default: aerodromeInitHash },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "5",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var ALIENBASE_V3 = {
  factories: { [Chain.BASE]: "0x0Fd83557b2be93617c9C1C1B6fd549401C74558C" },
  codeHash: {
    default: uniswapV3InitHash
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "6",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var BASEX_V3 = {
  factories: { [Chain.BASE]: "0x38015D05f4fEC8AFe15D7cc0386a126574e8077B" },
  codeHash: {
    default: uniswapV3InitHash
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "7",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var DACKIESWAP_V3 = {
  factories: {
    [Chain.BASE]: "0x4f205D69834f9B101b9289F7AFFAc9B77B3fF9b7",
    [Chain.OP_MAINNET]: "0xa466ebCfa58848Feb6D8022081f1C21a884889bB",
    [Chain.ARBITRUM_ONE]: "0xf79A36F6f440392C63AD61252a64d5d3C43F860D",
    [Chain.BLAST_MAINNET]: "0x6510E68561F04C1d111e616750DaC2a063FF5055",
    [Chain.WORLD_CHAIN]: "0xc6f3966E5D08Ced98aC30f8B65BeAB5882Be54C7"
  },
  codeHash: {
    default: uniswapV3InitHash,
    [Chain.BLAST]: "0x9173e4373ab542649f2f059b10eaab2181ad82cc2e70cf51cf9d9fa8a144a2af"
  },
  callbackSelector: pancakeV3CallbackSelector,
  forkId: "1",
  forkType: {
    default: "Pancake"
    /* Pancake */
  }
};
var KINETIX_V3 = {
  factories: {
    [Chain.BASE]: "0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf"
  },
  codeHash: {
    default: uniswapV3InitHash
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "8",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var DTX = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0xfCA1AEf282A99390B62Ca8416a68F5747716260c"
  },
  codeHash: {
    [Chain.TAIKO_ALETHIA]: uniswapV3InitHash
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "10",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var pancakeSwapV3InitHash = "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2";
var PANCAKESWAP_V3 = {
  factories: {
    [Chain.ETHEREUM_MAINNET]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
    [Chain.BASE]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
    [Chain.ARBITRUM_ONE]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
    [Chain.POLYGON_ZKEVM]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
    [Chain.ZKSYNC_MAINNET]: "0x7f71382044A6a62595D5D357fE75CA8199123aD6",
    [Chain.LINEA]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
    [Chain.OPBNB_MAINNET]: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9"
  },
  codeHash: {
    default: pancakeSwapV3InitHash
  },
  callbackSelector: pancakeV3CallbackSelector,
  forkId: "0",
  forkType: {
    default: "Pancake"
    /* Pancake */
  }
};
var PANKO_V3 = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x7DD105453D0AEf177743F5461d7472cC779e63f7"
  },
  codeHash: {
    default: pancakeSwapV3InitHash
  },
  callbackSelector: pancakeV3CallbackSelector,
  forkId: "1",
  forkType: {
    default: "Pancake"
    /* Pancake */
  }
};
var FUSIONX_V3 = {
  factories: {
    [Chain.MANTLE]: "0x7DD105453D0AEf177743F5461d7472cC779e63f7"
  },
  codeHash: {
    default: "0x1bce652aaa6528355d7a339037433a20cd28410e3967635ba8d2ddb037440dbf"
  },
  callbackSelector: "0xae067e0f00000000000000000000000000000000000000000000000000000000",
  forkId: "2",
  forkType: {
    default: "Pancake"
    /* Pancake */
  }
};
var AGNI = {
  factories: {
    [Chain.MANTLE]: "0xe9827b4ebeb9ae41fc57efdddd79edddc2ea4d03"
  },
  codeHash: {
    default: "0x1bce652aaa6528355d7a339037433a20cd28410e3967635ba8d2ddb037440dbf"
  },
  callbackSelector: "0x5bee97a300000000000000000000000000000000000000000000000000000000",
  forkId: "0",
  forkType: {
    default: "Pancake"
    /* Pancake */
  }
};
var METHLAB = {
  factories: {
    [Chain.MANTLE]: "0x8f140fc3e9211b8dc2fc1d7ee3292f6817c5dd5d"
  },
  codeHash: {
    default: "0xacd26fbb15704ae5e5fe7342ea8ebace020e4fa5ad4a03122ce1678278cf382b"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "10",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var WAGMI = {
  factories: {
    [Chain.ETHEREUM_MAINNET]: "0xB9a14EE1cd3417f3AcC988F61650895151abde24",
    [Chain.SONIC_MAINNET]: "0x56CFC796bC88C9c7e1b38C2b0aF9B7120B079aef",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0xE3Dc1A5a7aB81F1cC1895FA55034725c24a5BD0e",
    [Chain.AVALANCHE_C_CHAIN]: "0x08d6E1aE0f91423dDBD16f083ca39ccDd1D79cE8",
    [Chain.POLYGON_MAINNET]: "0x8bb1Be7acD806BF6C9766486dC4c21284a472BaC",
    [Chain.FANTOM_OPERA]: "0xaf20f5f19698f1D19351028cd7103B63D30DE7d7",
    [Chain.ARBITRUM_ONE]: "0x7301350CC76D669ea384e77aF38a70C61661CA48",
    [Chain.OP_MAINNET]: "0xC49c177736107fD8351ed6564136B9ADbE5B1eC3",
    [Chain.KAVA]: "0x0e0Ce4D450c705F8a0B6Dd9d5123e3df2787D16B",
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x8112E18a34b63964388a3B2984037d6a2EFE5B8A",
    [Chain.BASE]: "0x576A1301B42942537d38FB147895fE83fB418fD4",
    [Chain.IOTA_EVM]: "0x01Bd510B2eA106917e711f9a05a42fC162bee2Ac"
  },
  codeHash: {
    default: "0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "15",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var MAIA_V3 = {
  factories: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0xf5fd18Cd5325904cC7141cB9Daca1F2F964B9927"
  },
  codeHash: {
    default: uniswapV3InitHash
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "16",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var QUICKSWAP = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92",
    [Chain.DOGECHAIN_MAINNET]: "0x56c2162254b0E4417288786eE402c2B41d4e181e"
  },
  codeHash: {
    default: "0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "0",
  forkType: {
    default: "AlgebraV3"
    /* AlgebraV3 */
  }
};
var SWAPSICLE = {
  factories: {
    [Chain.MANTLE]: "0x9dE2dEA5c68898eb4cb2DeaFf357DFB26255a4aa",
    [Chain.TAIKO_ALETHIA]: "0xb68b27a1c93A52d698EecA5a759E2E4469432C09",
    [Chain.TELOS_EVM_MAINNET]: "0x061e47Ab9f31D293172efb88674782f80eCa88de"
  },
  codeHash: {
    [Chain.MANTLE]: "0x177d5fbf994f4d130c008797563306f1a168dc689f81b2fa23b4396931014d91",
    [Chain.TAIKO_ALETHIA]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d",
    [Chain.TELOS_EVM_MAINNET]: "0x177d5fbf994f4d130c008797563306f1a168dc689f81b2fa23b4396931014d91"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "1",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var HENJIN = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x0d22b434E478386Cd3564956BFc722073B3508f6"
  },
  codeHash: {
    [Chain.TAIKO_ALETHIA]: "0x4b9e4a8044ce5695e06fce9421a63b6f5c3db8a561eebb30ea4c775469e36eaf"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "2",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var CAMELOT = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0x6Dd3FB9653B10e806650F107C3B5A0a6fF974F65"
  },
  codeHash: {
    [Chain.ARBITRUM_ONE]: "0x6c1bebd370ba84753516bc1393c0d0a6c645856da55f5393ac8ab3d6dbc861d3"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "3",
  forkType: {
    default: "AlgebraV3_9"
    /* AlgebraV3_9 */
  }
};
var ATLAS = {
  factories: {
    [Chain.HEMI_NETWORK]: "0x6b46AE0e60E0E7a2F8614b3f1dCBf6D5a0102991"
  },
  codeHash: {
    [Chain.HEMI_NETWORK]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "4",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var THENA = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0xc89F69Baa3ff17a842AB2DE89E5Fc8a8e2cc7358"
  },
  codeHash: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0xd61302e7691f3169f5ebeca3a0a4ab8f7f998c01e55ec944e62cfb1109fd2736"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "5",
  forkType: {
    default: "AlgebraV3"
    /* AlgebraV3 */
  }
};
var ZYBERSWAP = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0x24E85F5F94C6017d2d87b434394e87df4e4D56E3",
    [Chain.OP_MAINNET]: "0xc0D4323426C709e8D04B5b130e7F059523464a91"
  },
  codeHash: {
    [Chain.ARBITRUM_ONE]: "0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4",
    [Chain.OP_MAINNET]: "0xbce37a54eab2fcd71913a0d40723e04238970e7fc1159bfd58ad5b79531697e7"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "7",
  forkType: {
    [Chain.ARBITRUM_ONE]: "AlgebraV3",
    [Chain.OP_MAINNET]: "AlgebraV3_9"
    /* AlgebraV3_9 */
  }
};
var SKULLSWAP = {
  factories: {
    [Chain.FANTOM_OPERA]: "0x630BC1372F73bf779AF5593A5a2Da68ABB3c6E55"
  },
  codeHash: {
    [Chain.FANTOM_OPERA]: "0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "8",
  forkType: {
    default: "AlgebraV3"
    /* AlgebraV3 */
  }
};
var UBESWAP2 = {
  factories: {
    [Chain.CELO_MAINNET]: "0xcC980E18E3efa39e4dD98F057A432343D534314D"
  },
  codeHash: {
    [Chain.CELO_MAINNET]: "0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "10",
  forkType: {
    default: "AlgebraV3"
    /* AlgebraV3 */
  }
};
var LITX = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x9cF85CaAC177Fb2296dcc68004e1C82A757F95ed"
  },
  codeHash: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "10",
  forkType: {
    default: "AlgebraV3"
    /* AlgebraV3 */
  }
};
var STELLASWAP = {
  factories: {
    [Chain.MOONBEAM]: "0x87a4F009f99E2F34A34A260bEa765877477c7EF9"
  },
  codeHash: {
    [Chain.MOONBEAM]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "11",
  forkType: {
    default: "AlgebraV3"
    /* AlgebraV3 */
  }
};
var LYNEX = {
  factories: {
    [Chain.LINEA]: "0x9A89490F1056A7BC607EC53F93b921fE666A2C48"
  },
  codeHash: {
    [Chain.LINEA]: "0xc65e01e65f37c1ec2735556a24a9c10e4c33b2613ad486dd8209d465524bc3f4"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "12",
  forkType: {
    default: "AlgebraV3_9"
    /* AlgebraV3_9 */
  }
};
var SWAP_BASED = {
  factories: {
    [Chain.BASE]: "0xe4DFd4ad723B5DB11aa41D53603dB03B117eC690"
  },
  codeHash: {
    [Chain.BASE]: "0xbce37a54eab2fcd71913a0d40723e04238970e7fc1159bfd58ad5b79531697e7"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "13",
  forkType: {
    default: "AlgebraV3_9"
    /* AlgebraV3_9 */
  }
};
var SYNTHSWAP = {
  factories: {
    [Chain.BASE]: "0xBA97f8AEe67BaE3105fB4335760B103F24998a92"
  },
  codeHash: {
    [Chain.BASE]: "0xbce37a54eab2fcd71913a0d40723e04238970e7fc1159bfd58ad5b79531697e7"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "14",
  forkType: {
    default: "AlgebraV3_9"
    /* AlgebraV3_9 */
  }
};
var HERCULES2 = {
  factories: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x43AA9b2eD25F972fD8D44fDfb77a4a514eAB4d71"
  },
  codeHash: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x6c1bebd370ba84753516bc1393c0d0a6c645856da55f5393ac8ab3d6dbc861d3"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "30",
  forkType: {
    default: "AlgebraV3_9"
    /* AlgebraV3_9 */
  }
};
var KIM = {
  factories: {
    [Chain.MODE]: "0x6414A461B19726410E52488d9D5ff33682701635"
  },
  codeHash: {
    [Chain.MODE]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "16",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var FENIX = {
  factories: {
    [Chain.BLAST_MAINNET]: "0x5aCCAc55f692Ae2F065CEdDF5924C8f6B53cDaa8"
  },
  codeHash: {
    [Chain.BLAST_MAINNET]: "0xf45e886a0794c1d80aeae5ab5befecd4f0f2b77c0cf627f7c46ec92dc1fa00e4"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "17",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var BLADE = {
  factories: {
    [Chain.BLAST_MAINNET]: "0xfFeEcb1fe0EAaEFeE69d122F6B7a0368637cb593"
  },
  codeHash: {
    [Chain.BLAST_MAINNET]: "0xa9df2657ce5872e94bdc9525588fd983b0aa5db2f3c7a83d7e6b6a99cd2003a1"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "18",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var SILVER_SWAP = {
  factories: {
    [Chain.FANTOM_OPERA]: "0x98AF00a67F5cC0b362Da34283D7d32817F6c9A29"
  },
  codeHash: {
    [Chain.FANTOM_OPERA]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "19",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var HORIZON = {
  factories: {
    [Chain.LINEA]: "0xA76990a229961280200165c4e08c96Ea67304C3e"
  },
  codeHash: {
    [Chain.LINEA]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "30",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var GLYPH = {
  factories: {
    [Chain.CORE_BLOCKCHAIN_MAINNET]: "0x24196b3f35E1B8313016b9f6641D605dCf48A76a"
  },
  codeHash: {
    [Chain.CORE_BLOCKCHAIN_MAINNET]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "21",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var SWAPX = {
  factories: {
    [Chain.SONIC_MAINNET]: "0x885229E48987EA4c68F0aA1bCBff5184198A9188"
  },
  codeHash: {
    [Chain.SONIC_MAINNET]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "22",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var BULLA = {
  factories: {
    [Chain.BERACHAIN]: "0x425EC3de5FEB62897dbe239Aa218B2DC035DCDF1"
  },
  codeHash: {
    [Chain.BERACHAIN]: "0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "23",
  forkType: {
    default: "AlgebraV4"
    /* AlgebraV4 */
  }
};
var SCRIBE = {
  factories: {
    [Chain.SCROLL]: "0xbAE27269D777D6fc0AefFa9DfAbA8960291E51eB"
  },
  codeHash: {
    [Chain.SCROLL]: "0x4b9e4a8044ce5695e06fce9421a63b6f5c3db8a561eebb30ea4c775469e36eaf"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "24",
  forkType: {
    default: "AlgebraV4_1"
    /* AlgebraV4_1 */
  }
};
var FIBONACCI = {
  factories: {
    [Chain.FORM_NETWORK]: "0x1d204Ba9fceD9E5a228727Cd4Ce89620B4e4999a"
  },
  codeHash: {
    [Chain.FORM_NETWORK]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "25",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var VOLTAGE = {
  factories: {
    [Chain.FUSE_MAINNET]: "0x9F02d3ddbC690bc65d81A98B93d449528AC4eB8C"
  },
  codeHash: {
    [Chain.FUSE_MAINNET]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "26",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var WASABEE = {
  factories: {
    [Chain.BERACHAIN]: "0x598f320907c2FFDBC715D591ffEcC3082bA14660"
  },
  codeHash: {
    [Chain.BERACHAIN]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "27",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var HOLIVERSE = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x0b643D3A5903ED89921b85c889797dd9887125Ad"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "28",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var MOR_FI = {
  factories: {
    [Chain.MORPH]: "0xc1db2471ea7ea9227ea02f427543177d63afe44f"
  },
  codeHash: {
    [Chain.MORPH]: "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85"
  },
  callbackSelector: algebraV3CallbackSelector,
  forkId: "29",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var SHADOW_CL = {
  factories: {
    [Chain.SONIC_MAINNET]: "0x8BBDc15759a8eCf99A92E004E0C64ea9A5142d59"
  },
  codeHash: {
    [Chain.SONIC_MAINNET]: "0xc701ee63862761c31d620a4a083c61bdc1e81761e6b9c9267fd19afd22e0821d"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "11",
  forkType: {
    default: "AlgebraV4_2"
    /* AlgebraV4_2 */
  }
};
var BUTTER = {
  factories: {
    [Chain.MANTLE]: "0xEECa0a86431A7B42ca2Ee5F479832c3D4a4c2644"
  },
  codeHash: {
    [Chain.MANTLE]: "0xc7d06444331e4f63b0764bb53c88788882395aa31961eed3c2768cc9568323ee"
  },
  callbackSelector: "0xe5f6c0f800000000000000000000000000000000000000000000000000000000",
  forkId: "0",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var CRUST = {
  factories: {
    [Chain.MANTLE]: "0xEaD128BDF9Cff441eF401Ec8D18a96b4A2d25252"
  },
  codeHash: {
    [Chain.MANTLE]: "0x55664e1b1a13929bcf29e892daf029637225ec5c85a385091b8b31dcca255627"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "12",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var RETRO = {
  factories: {
    [Chain.POLYGON_MAINNET]: "0x91e1B99072f238352f59e58de875691e20Dc19c1"
  },
  codeHash: {
    [Chain.POLYGON_MAINNET]: "0x817e07951f93017a93327ac8cc31e946540203a19e1ecc37bc1761965c2d1090"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "13",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var NILE_CL = {
  factories: {
    [Chain.LINEA]: "0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42"
  },
  codeHash: {
    [Chain.LINEA]: "0x1565b129f2d1790f12d45301b9b084335626f0c92410bc43130763b69971135d"
  },
  callbackSelector: ramsesV2CallbackSelector,
  forkId: "2",
  forkType: {
    default: "Ramses"
    /* Ramses */
  }
};
var KOI_CL = {
  factories: {
    [Chain.ZKSYNC_MAINNET]: "0x488A92576DA475f7429BC9dec9247045156144D3"
  },
  codeHash: {
    [Chain.ZKSYNC_MAINNET]: "0x0100128b709068f187cf0a565f39cd8d90baf51a12a5717aebcdf69a503234b9"
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "10",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var IZUMI = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x93BB94a0d5269cb437A1F71FF3a77AB753844422",
    [Chain.ETHEREUM_MAINNET]: "0x93BB94a0d5269cb437A1F71FF3a77AB753844422",
    [Chain.MANTLE]: "0x45e5F26451CDB01B0fA1f8582E0aAD9A6F27C218",
    [Chain.POLYGON_MAINNET]: "0xcA7e21764CD8f7c1Ec40e651E25Da68AeD096037",
    [Chain.TAIKO_ALETHIA]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.ARBITRUM_ONE]: "0xCFD8A067e1fa03474e79Be646c5f6b6A27847399",
    [Chain.HEMI_NETWORK]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.METER_MAINNET]: "0xed31C5a9C764761C3A699E2732183ba5d6EAcC35",
    [Chain.ZKSYNC_MAINNET]: "0x575Bfc57B0D3eA0d31b132D622643e71735A6957",
    [Chain.ONTOLOGY_MAINNET]: "0x032b241De86a8660f1Ae0691a4760B426EA246d7",
    [Chain.LINEA]: "0x45e5F26451CDB01B0fA1f8582E0aAD9A6F27C218",
    [Chain.ETHEREUM_CLASSIC]: "0x79D175eF5fBe31b5D84B3ee359fcbBB466153E39",
    [Chain.BASE]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.OPBNB_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.KROMA]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.MANTA_PACIFIC_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.SCROLL]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.ZKFAIR_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.ZETACHAIN_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.MERLIN_MAINNET]: "0xE29a6620DAc789B8a76e9b9eC8fE9B7cf2B663D5",
    [Chain.BLAST]: "0x5162f29E9626CF7186ec40ab97D92230B428ff2d",
    [Chain.ZKLINK_NOVA_MAINNET]: "0x33D9936b7B7BC155493446B5E6dDC0350EB83AEC",
    [Chain.MODE]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.MAP_PROTOCOL]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    // [Chain.ANVN]: '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
    [Chain.X_LAYER_MAINNET]: "0xBf8F8Ef2d2a534773c61682Ea7cF5323a324B188",
    [Chain.BOB]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.KAIA_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.KAVA]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.ROOTSTOCK_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.CYBER_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.CORE_BLOCKCHAIN_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.NEON_EVM_MAINNET]: "0x3EF68D3f7664b2805D4E88381b64868a56f88bC4",
    [Chain.GRAVITY_ALPHA_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.EVM_ON_FLOW]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.IOTEX_NETWORK_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.MORPH]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
    [Chain.HASHKEY_CHAIN]: "0x110dE362cc436D7f54210f96b8C7652C2617887D",
    [Chain.PLUME_MAINNET]: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08"
  },
  codeHash: { default: "0xbe0bfe068cdd78cafa3ddd44e214cfa4e412c15d7148e932f8043fe883865e40" },
  forkId: "0",
  forkType: {
    default: "Izumi"
    /* Izumi */
  }
};
var BISWAP_V3 = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x7C3d53606f9c03e7f54abdDFFc3868E1C5466863"
  },
  codeHash: { default: "0x712a91d34948c3b3e0b473b519235f7d14dbf2472983bc5d3f7e67c501d7a348" },
  forkId: "1",
  forkType: {
    default: "Izumi"
    /* Izumi */
  }
};
var SQUADSWAP_V3 = {
  factories: {
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x127AA917Ace4a3880fa5E193947F2190829144A4",
    [Chain.ARBITRUM_ONE]: "0xEa006904113a96995e51Cd9065CA6b9833da7fb1",
    [Chain.BASE]: "0x53616b1BAA9e224092Bbaf64f2FB5dA2b11dd62a",
    [Chain.BLAST]: "0xF99185C93274E5dE2DC8D52D3b9Fd917b1dD4A35",
    [Chain.POLYGON_MAINNET]: "0x6d3A3aC01E7ADaD98480b5d4951a83b141c8Fd75",
    [Chain.OP_MAINNET]: "0x53616b1BAA9e224092Bbaf64f2FB5dA2b11dd62a"
  },
  codeHash: {
    default: "0xff132c7c84e5449c9d69fc8490aba7f25fe4033e8889a13556c416128e1308cf"
  },
  callbackSelector: "0xc4e21d8600000000000000000000000000000000000000000000000000000000",
  // squadV3SwapCallback
  forkId: "30",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var RAMSES_V2 = {
  factories: {
    [Chain.ARBITRUM_ONE]: "0xAA2cd7477c451E703f3B9Ba5663334914763edF8"
  },
  codeHash: { default: "0x1565b129f2d1790f12d45301b9b084335626f0c92410bc43130763b69971135d" },
  callbackSelector: ramsesV2CallbackSelector,
  forkId: "0",
  forkType: {
    default: "Ramses"
    /* Ramses */
  }
};
var CLEOPATRA = {
  factories: {
    [Chain.MANTLE]: "0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42"
  },
  codeHash: { default: "0x1565b129f2d1790f12d45301b9b084335626f0c92410bc43130763b69971135d" },
  callbackSelector: ramsesV2CallbackSelector,
  forkId: "1",
  forkType: {
    default: "Ramses"
    /* Ramses */
  }
};
var PHARAOH_CL = {
  factories: {
    [Chain.AVALANCHE_C_CHAIN]: "0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42"
  },
  codeHash: { default: "0x1565b129f2d1790f12d45301b9b084335626f0c92410bc43130763b69971135d" },
  callbackSelector: ramsesV2CallbackSelector,
  forkId: "1",
  forkType: {
    default: "Ramses"
    /* Ramses */
  }
};
var ZKSWAP_V3 = {
  factories: {
    [Chain.ZKSYNC_MAINNET]: "0x57d28Af38D126beFEbfDe996B7cDc34d58Ad4CFB"
  },
  codeHash: { [Chain.ZKSYNC_MAINNET]: "0x010012918CB9618AE4BA2ABC0113216D1639E06949000CAC6E32E7D7811E625D" },
  callbackSelector: "0xb527c5d000000000000000000000000000000000000000000000000000000000",
  forkId: "0",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var UNAGI_V3 = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x78172691DD3B8ADa7aEbd9bFfB487FB11D735DB2"
  },
  codeHash: { [Chain.TAIKO_ALETHIA]: "0x5ccd5621c1bb9e44ce98cef8b90d31eb2423dec3793b6239232cefae976936ea" },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "20",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var AXION_V3 = {
  factories: {
    [Chain.TAIKO_ALETHIA]: "0x34a9F4a8F3A8d57Ec3B5ab823442572ae740C92f"
  },
  codeHash: { [Chain.TAIKO_ALETHIA]: "0x101e6602a77572eb84dbb680d0904690b023afbe1ba9323cc3cb2644c82ebd25" },
  callbackSelector: "0x0102795e00000000000000000000000000000000000000000000000000000000",
  // axionV3SwapCallback
  forkId: "0",
  forkType: {
    default: "Pancake"
    /* Pancake */
  }
};
var VELODROME_V3 = {
  factories: {
    [Chain.OP_MAINNET]: "0xCc0bDDB707055e04e497aB22a59c2aF4391cd12F",
    [Chain.CELO_MAINNET]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.SWELLCHAIN]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.SONEIUM]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.LISK]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.INK]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.MODE]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.FRAXTAL]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.UNICHAIN]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
    [Chain.BOB]: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F"
  },
  implementation: {
    [Chain.OP_MAINNET]: "0xc28aD28853A547556780BEBF7847628501A3bCbb",
    // remaining chains have consistent data
    default: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8"
    // [Chain.CELO_MAINNET]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.SWELLCHAIN]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.SONEIUM]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.LISK]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.INK]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.MODE]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.FRAXTAL]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.UNICHAIN]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
    // [Chain.BOB]: "0x321f7Dfb9B2eA9131B8C17691CF6e01E5c149cA8",
  },
  codeHash: {
    // keccak256(hex"363d3d373d3d3d363d73${implementation}5af43d82803e903d91602b57fd5bf3")
    [Chain.OP_MAINNET]: "0x339492e30b7a68609e535da9b0773082bfe60230ca47639ee5566007d525f5a7",
    // remaining chains have consistent data
    default: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5"
    // [Chain.CELO_MAINNET]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.SWELLCHAIN]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.SONEIUM]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.LISK]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.INK]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.MODE]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.FRAXTAL]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.UNICHAIN]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
    // [Chain.BOB]: "0x7b216153c50849f664871825fa6f22b3356cdce2436e4f48734ae2a926a4c7e5",
  },
  callbackSelector: uniswapV3CallbackSelector,
  forkId: "19",
  forkType: {
    default: "Classic"
    /* Classic */
  }
};
var UNISWAP_V3_FORKS = {
  [
    "UNISWAP_V3"
    /* UNISWAP_V3 */
  ]: UNISWAP_V3,
  [
    "SUSHISWAP_V3"
    /* SUSHISWAP_V3 */
  ]: SUSHISWAP_V3,
  [
    "SOLIDLY_V3"
    /* SOLIDLY_V3 */
  ]: SOLIDLY_V3,
  [
    "PANCAKESWAP_V3"
    /* PANCAKESWAP_V3 */
  ]: PANCAKESWAP_V3,
  [
    "DACKIESWAP_V3"
    /* DACKIESWAP_V3 */
  ]: DACKIESWAP_V3,
  [
    "ALIENBASE_V3"
    /* ALIENBASE_V3 */
  ]: ALIENBASE_V3,
  [
    "BASEX_V3"
    /* BASEX_V3 */
  ]: BASEX_V3,
  [
    "KINETIX_V3"
    /* KINETIX_V3 */
  ]: KINETIX_V3,
  [
    "AERODROME_SLIPSTREAM"
    /* AERODROME_SLIPSTREAM */
  ]: AERODROME_SLIPSTREAM,
  [
    "QUICKSWAP_V3"
    /* QUICKSWAP_V3 */
  ]: QUICKSWAP,
  [
    "HENJIN"
    /* HENJIN */
  ]: HENJIN,
  [
    "SWAPSICLE"
    /* SWAPSICLE */
  ]: SWAPSICLE,
  [
    "AGNI"
    /* AGNI */
  ]: AGNI,
  [
    "FUSIONX_V3"
    /* FUSIONX_V3 */
  ]: FUSIONX_V3,
  [
    "METHLAB"
    /* METHLAB */
  ]: METHLAB,
  [
    "PANKO"
    /* PANKO */
  ]: PANKO_V3,
  [
    "CAMELOT"
    /* CAMELOT */
  ]: CAMELOT,
  [
    "DTX"
    /* DTX */
  ]: DTX,
  [
    "ATLAS"
    /* ATLAS */
  ]: ATLAS,
  [
    "THENA"
    /* THENA */
  ]: THENA,
  [
    "ZYBERSWAP"
    /* ZYBERSWAP */
  ]: ZYBERSWAP,
  [
    "SKULLSWAP"
    /* SKULLSWAP */
  ]: SKULLSWAP,
  [
    "UBESWAP"
    /* UBESWAP */
  ]: UBESWAP2,
  [
    "LITX"
    /* LITX */
  ]: LITX,
  [
    "STELLASWAP"
    /* STELLASWAP */
  ]: STELLASWAP,
  [
    "LYNEX"
    /* LYNEX */
  ]: LYNEX,
  [
    "SWAP_BASED"
    /* SWAP_BASED */
  ]: SWAP_BASED,
  [
    "SYNTHSWAP"
    /* SYNTHSWAP */
  ]: SYNTHSWAP,
  [
    "HERCULES"
    /* HERCULES */
  ]: HERCULES2,
  [
    "KIM"
    /* KIM */
  ]: KIM,
  [
    "FENIX"
    /* FENIX */
  ]: FENIX,
  [
    "BLADE"
    /* BLADE */
  ]: BLADE,
  [
    "SILVER_SWAP"
    /* SILVER_SWAP */
  ]: SILVER_SWAP,
  [
    "HORIZON"
    /* HORIZON */
  ]: HORIZON,
  [
    "GLYPH"
    /* GLYPH */
  ]: GLYPH,
  [
    "SWAPX"
    /* SWAPX */
  ]: SWAPX,
  [
    "BULLA"
    /* BULLA */
  ]: BULLA,
  [
    "SCRIBE"
    /* SCRIBE */
  ]: SCRIBE,
  [
    "FIBONACCI"
    /* FIBONACCI */
  ]: FIBONACCI,
  [
    "VOLTAGE"
    /* VOLTAGE */
  ]: VOLTAGE,
  [
    "WASABEE"
    /* WASABEE */
  ]: WASABEE,
  [
    "HOLIVERSE"
    /* HOLIVERSE */
  ]: HOLIVERSE,
  [
    "MOR_FI"
    /* MOR_FI */
  ]: MOR_FI,
  [
    "SHADOW_CL"
    /* SHADOW_CL */
  ]: SHADOW_CL,
  [
    "SQUADSWAP_V3"
    /* SQUADSWAP_V3 */
  ]: SQUADSWAP_V3,
  [
    "BUTTER"
    /* BUTTER */
  ]: BUTTER,
  [
    "CRUST"
    /* CRUST */
  ]: CRUST,
  [
    "RETRO"
    /* RETRO */
  ]: RETRO,
  [
    "WAGMI"
    /* WAGMI */
  ]: WAGMI,
  [
    "MAIA_V3"
    /* MAIA_V3 */
  ]: MAIA_V3,
  [
    "CLEOPATRA"
    /* CLEOPATRA */
  ]: CLEOPATRA,
  [
    "RAMSES_V2"
    /* RAMSES_V2 */
  ]: RAMSES_V2,
  [
    "PHARAOH_CL"
    /* PHARAOH_CL */
  ]: PHARAOH_CL,
  [
    "VELODROME_V3"
    /* VELODROME_V3 */
  ]: VELODROME_V3,
  [
    "NILE_CL"
    /* NILE_CL */
  ]: NILE_CL,
  [
    "KOI_CL"
    /* KOI_CL */
  ]: KOI_CL,
  [
    "ZKSWAP_V3"
    /* ZKSWAP_V3 */
  ]: ZKSWAP_V3,
  [
    "UNAGI_V3"
    /* UNAGI_V3 */
  ]: UNAGI_V3,
  [
    "AXION_V3"
    /* AXION_V3 */
  ]: AXION_V3
};
var IZUMI_FORKS = {
  [
    "IZUMI"
    /* IZUMI */
  ]: IZUMI,
  [
    "BISWAP_V3"
    /* BISWAP_V3 */
  ]: BISWAP_V3
};
var UNISWAP_V4 = {
  pm: {
    [Chain.ETHEREUM_MAINNET]: "0x000000000004444c5dc75cB358380D2e3dE08A90",
    [Chain.ARBITRUM_ONE]: "0x360E68faCcca8cA495c1B759Fd9EEe466db9FB32",
    [Chain.AVALANCHE_C_CHAIN]: "0x06380C0e0912312B5150364B9DC4542BA0DbBc85",
    [Chain.BASE]: "0x498581fF718922c3f8e6A244956aF099B2652b2b",
    [Chain.BLAST]: "0x1631559198A9e474033433b2958daBC135ab6446",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x28e2Ea090877bF75740558f6BFB36A5ffeE9e9dF",
    [Chain.OP_MAINNET]: "0x9a13F98Cb987694C9F086b1F5eB990EeA8264Ec3",
    [Chain.POLYGON_MAINNET]: "0x67366782805870060151383F4BbFF9daB53e5cD6",
    [Chain.WORLD_CHAIN]: "0xb1860D529182ac3BC1F51Fa2ABd56662b7D13f33",
    [Chain.ZORA]: "0x0575338e4c17006ae181b47900a84404247ca30f",
    [Chain.INK]: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
    [Chain.SONEIUM]: "0x360e68faccca8ca495c1b759fd9eee466db9fb32"
  },
  forkId: "0"
};
var UNISWAP_V4_FORKS = {
  [
    "UNISWAP_V4"
    /* UNISWAP_V4 */
  ]: UNISWAP_V4
};
({
  // https://docs.mav.xyz/technical-reference/contract-addresses/v2-contract-addresses
  // For chains: mainnet, base, bnb, arbitrum, scroll, sepolia
  factories: {
    [Chain.ETHEREUM_MAINNET]: "0x0A7e848Aca42d879EF06507Fca0E7b33A0a63c1e",
    [Chain.BASE]: "0x0A7e848Aca42d879EF06507Fca0E7b33A0a63c1e",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x0A7e848Aca42d879EF06507Fca0E7b33A0a63c1e",
    [Chain.ARBITRUM_ONE]: "0x0A7e848Aca42d879EF06507Fca0E7b33A0a63c1e",
    [Chain.SCROLL]: "0x0A7e848Aca42d879EF06507Fca0E7b33A0a63c1e"
  }
});
({
  [Chain.HEMI_NETWORK]: {
    },
  [Chain.ARBITRUM_ONE]: {
    },
  [Chain.AURORA_MAINNET]: {
    },
  [Chain.AVALANCHE_C_CHAIN]: {
    },
  [Chain.BNB_SMART_CHAIN_MAINNET]: {
    },
  [Chain.BASE]: {
    },
  [Chain.BITLAYER_MAINNET]: {
    },
  [Chain.BOBA_NETWORK]: {
    },
  [Chain.CONFLUX_ESPACE]: {
    },
  [Chain.ETHEREUM_MAINNET]: {
    },
  [Chain.HASHKEY_CHAIN]: {
    },
  [Chain.LINEA]: {
    },
  [Chain.MANTA_PACIFIC_MAINNET]: {
    },
  [Chain.MANTLE]: {
    },
  [Chain.MOONRIVER]: {
    },
  [Chain.OKXCHAIN_MAINNET]: {
    },
  [Chain.OP_MAINNET]: {
    },
  [Chain.POLYGON_MAINNET]: {
    },
  [Chain.SCROLL]: {
    },
  [Chain.X_LAYER_MAINNET]: {
    },
  [Chain.ZIRCUIT_MAINNET]: {
    }
});
({
  vault: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0xD2032462fd8A45C4BE8F5b90DE25eE3631ec1c2C"
  },
  router: {
    [Chain.METIS_ANDROMEDA_MAINNET]: "0x3931DB2254808F220e81e8e45666F709BA7BDebF"
  }
});
({
  vault: {
    [Chain.ARBITRUM_ONE]: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    [Chain.AVALANCHE_C_CHAIN]: "0x9ab2De34A33fB459b538c43f251eB825645e8595"
  },
  router: {
    [Chain.ARBITRUM_ONE]: "0x22199a49A999c351eF7927602CFB187ec3cae489",
    [Chain.AVALANCHE_C_CHAIN]: "0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8"
  }
});
({
  vault: {
    [Chain.MANTLE]: "0xD2032462fd8A45C4BE8F5b90DE25eE3631ec1c2C",
    [Chain.ARBITRUM_ONE]: "0xc657A1440d266dD21ec3c299A8B9098065f663Bb"
  },
  vaultUtils: {
    [Chain.MANTLE]: "0xbde9c699e719bb44811252FDb3B37E6D3eDa5a28"
  }
});
({
  /** Aave V3s */
  [Lender.AAVE_V3]: 0,
  [Lender.AAVE_V3_PRIME]: 1,
  [Lender.AAVE_V3_ETHER_FI]: 2,
  // reserve for more aave V3s
  [Lender.SPARK]: 10,
  // zerolends
  [Lender.ZEROLEND]: 20,
  [Lender.ZEROLEND_STABLECOINS_RWA]: 21,
  [Lender.ZEROLEND_ETH_LRTS]: 22,
  [Lender.ZEROLEND_BTC_LRTS]: 23,
  [Lender.ZEROLEND_CROAK]: 24,
  [Lender.ZEROLEND_FOXY]: 25,
  // avalons
  [Lender.AVALON]: 50,
  [Lender.AVALON_SOLV_BTC]: 51,
  [Lender.AVALON_SWELL_BTC]: 52,
  [Lender.AVALON_PUMP_BTC]: 53,
  [Lender.AVALON_EBTC_LBTC]: 54,
  [Lender.AVALON_USDA]: 55,
  [Lender.AVALON_SKAIA]: 56,
  [Lender.AVALON_LORENZO]: 57,
  [Lender.AVALON_INNOVATION]: 58,
  [Lender.AVALON_UBTC]: 59,
  [Lender.AVALON_OBTC]: 60,
  [Lender.AVALON_BEETS]: 61,
  [Lender.AVALON_UNILOTX]: 62,
  [Lender.AVALON_BOB]: 63,
  [Lender.AVALON_STBTC]: 64,
  [Lender.AVALON_WBTC]: 65,
  [Lender.AVALON_LBTC]: 66,
  [Lender.AVALON_XAUM]: 67,
  [Lender.AVALON_LISTA]: 68,
  [Lender.AVALON_USDX]: 69,
  [Lender.AVALON_UNIBTC]: 70,
  // more exotics
  [Lender.HANA]: 81,
  [Lender.KINZA]: 82,
  [Lender.LENDOS]: 83,
  [Lender.MAGSIN]: 84,
  [Lender.XLEND]: 85,
  [Lender.RHOMBUS]: 86,
  [Lender.SAKE]: 87,
  [Lender.SAKE_ASTAR]: 88,
  [Lender.RMM]: 90,
  [Lender.LAYERBANK_V3]: 91,
  // exotic
  [Lender.YLDR]: 100,
  /** Aave V2s */
  [Lender.AAVE_V2]: 0,
  [Lender.AURELIUS]: 2,
  [Lender.LENDLE]: 1,
  [Lender.MERIDIAN]: 3,
  [Lender.TAKOTAKO]: 4,
  [Lender.TAKOTAKO_ETH]: 5,
  [Lender.NEREUS]: 6,
  [Lender.GRANARY]: 7,
  [Lender.LORE]: 8,
  [Lender.IRONCLAD_FINANCE]: 9,
  [Lender.MOLEND]: 10,
  [Lender.POLTER]: 11,
  [Lender.SEISMIC]: 12,
  [Lender.AGAVE]: 13,
  [Lender.MOOLA]: 14,
  [Lender.KLAP]: 15,
  [Lender.KLAYBANK]: 16,
  // Morphos
  [Lender.MORPHO_BLUE]: 0});
({
  ...Object.fromEntries(Object.entries(UNISWAP_V2_FORKS).map(([protocol, info]) => [protocol, info.forkId])),
  ...Object.fromEntries(Object.entries(UNISWAP_V3_FORKS).map(([protocol, info]) => [protocol, info.forkId])),
  ...Object.fromEntries(Object.entries(IZUMI_FORKS).map(([protocol, info]) => [protocol, info.forkId])),
  ...Object.fromEntries(Object.entries(UNISWAP_V4_FORKS).map(([protocol, info]) => [protocol, info.forkId])),
  ...Object.fromEntries(Object.entries(BALANCER_V2_FORKS).map(([protocol, info]) => [protocol, info.forkId])),
  ...Object.fromEntries(Object.entries(BALANCER_V3_FORKS).map(([protocol, info]) => [protocol, info.forkId]))});
function adjustOutputForSlippage(output, slippageToleranceBps) {
  return output * BPS_BASE / (BPS_BASE + BigInt(slippageToleranceBps));
}
function adjustInputForSlippge(input, slippageToleranceBps) {
  return input * (BPS_BASE + BigInt(slippageToleranceBps)) / BPS_BASE;
}
function assetIdInput(contractId) {
  return { bits: contractId };
}
function addressInput(address) {
  return { Address: { bits: Address.fromAddressOrString(address).toB256() } };
}
function contractIdInput(contractId) {
  return { ContractId: { bits: Address.fromAddressOrString(contractId).toB256() } };
}
function getDexReceiver(protocol) {
  switch (protocol) {
    case DexProtocol.MIRA_STABLE:
    case DexProtocol.MIRA_VOLATILE:
      return MIRA_AMM_ID;
    case DexProtocol.DIESEL_STABLE:
    case DexProtocol.DIESEL_VOLATILE:
      return DIESEL_AMM_ID;
    default:
      throw new Error("Invalid DEX");
  }
}
function getDexContracts(protocols) {
  return _.uniq(
    _.uniq(protocols).map((protocol) => {
      switch (protocol) {
        case DexProtocol.MIRA_STABLE:
        case DexProtocol.MIRA_VOLATILE:
          return [MIRA_AMM_ID, MIRA_HOOKS_ID];
        case DexProtocol.DIESEL_STABLE:
        case DexProtocol.DIESEL_VOLATILE:
          return [DIESEL_AMM_ID];
        default:
          throw new Error("Invalid DEX");
      }
    }).flat()
  );
}
function aggregateInputs(qts) {
  const ccys = _.uniq(qts.map((q2) => q2.assetId));
  let q = [];
  ccys.map((assetId) => {
    const amount = qts.filter((q2) => q2.assetId === assetId).reduce((a, b) => a + BigInt(b.amount.toString()), 0n).toString();
    q.push({
      assetId,
      amount
    });
  });
  return q;
}

// src/fuel/converter/trade/step.ts
function populateStepFromSwap(pool, tokenIn, tokenOut, currentReceiver) {
  return {
    dex_id: 0,
    // only diesel and mira as v2 forks
    asset_in: assetIdInput(tokenIn.address),
    asset_out: assetIdInput(tokenOut.address),
    receiver: currentReceiver,
    data: pool.swapParams.data.map((id) => Number(id))
  };
}
var CurrencyUtils;
((CurrencyUtils2) => {
  function getAmount(c) {
    return BigInt(c.amount);
  }
  CurrencyUtils2.getAmount = getAmount;
  function isNative(c) {
    return c.address === zeroAddress;
  }
  CurrencyUtils2.isNative = isNative;
  function isNativeAmount(c) {
    return c.currency.address === zeroAddress;
  }
  CurrencyUtils2.isNativeAmount = isNativeAmount;
  function fromRawAmount(currency, amount) {
    return {
      currency,
      amount: String(amount)
    };
  }
  CurrencyUtils2.fromRawAmount = fromRawAmount;
})(CurrencyUtils || (CurrencyUtils = {}));

// src/fuel/converter/trade/toParameters.ts
function getFuelParametersExactInFromTrade(trade, receiver, slippageToleranceBps) {
  let path = [];
  let allProtocols = [];
  let inputAssets = [];
  for (let swap of trade.swaps) {
    let pool = swap.route.pools[0];
    const amountIn = CurrencyUtils.getAmount(swap.inputAmount);
    const inputQuantity = {
      assetId: swap.inputAmount.currency.address,
      amount: amountIn
    };
    inputAssets.push(inputQuantity);
    let steps = [];
    const length = swap.route.pools.length;
    const tokenPath = swap.route.path;
    const lastIndex = length - 1;
    for (let i = 0; i < length; i++) {
      pool = swap.route.pools[i];
      const currentReceiver = i === lastIndex ? addressInput(receiver) : contractIdInput(getDexReceiver(swap.route.pools[i + 1].protocol));
      allProtocols.push(pool.protocol);
      const step = populateStepFromSwap(pool, tokenPath[i], tokenPath[i + 1], currentReceiver);
      steps.push(step);
      if (i < lastIndex) pool = swap.route.pools[i + 1];
    }
    const minimumOut = adjustOutputForSlippage(CurrencyUtils.getAmount(swap.outputAmount), slippageToleranceBps);
    const routeEncoded = [amountIn.toString(), minimumOut.toString(), true, steps];
    path.push(routeEncoded);
  }
  return {
    path,
    inputAssets: aggregateInputs(inputAssets),
    variableOutputs: trade.swaps.length,
    inputContracts: [...getDexContracts(allProtocols), DEAD_LOGGER]
  };
}
function getFuelParametersExactOutFromTrade(trade, receiver, slippageToleranceBps) {
  let path = [];
  let allProtocols = [];
  let inputAssets = [];
  for (let swap of trade.swaps) {
    const length = swap.route.pools.length;
    const lastIndex = length - 1;
    let pool = swap.route.pools[lastIndex];
    const amountOut = CurrencyUtils.getAmount(swap.outputAmount);
    let steps = [];
    const tokenPath = swap.route.path;
    for (let i = lastIndex; i > -1; i--) {
      const currentReceiver = i === lastIndex ? addressInput(receiver) : contractIdInput(getDexReceiver(swap.route.pools[i + 1].protocol));
      allProtocols.push(pool.protocol);
      const step = populateStepFromSwap(pool, tokenPath[i], tokenPath[i + 1], currentReceiver);
      steps.push(step);
      if (i > 0) pool = swap.route.pools[i - 1];
    }
    const amount = CurrencyUtils.getAmount(swap.inputAmount);
    const maximumIn = adjustInputForSlippge(amount, slippageToleranceBps);
    const inputQuantity = {
      assetId: swap.inputAmount.currency.address,
      max: (maximumIn + 1n).toString(),
      // need buffer for correcly throwing slippage error
      amount: amount.toString()
    };
    inputAssets.push(inputQuantity);
    const routeEncoded = [amountOut.toString(), maximumIn.toString(), true, steps];
    path.push(routeEncoded);
  }
  return {
    path,
    inputAssets: aggregateInputs(inputAssets),
    variableOutputs: trade.swaps.length,
    inputContracts: [...getDexContracts(allProtocols), DEAD_LOGGER]
  };
}

// src/fuel/converter/trade/index.ts
function getEncodedFuelPathFromTrade(trade, receiver, slippageToleranceBps, deadline) {
  if (trade.tradeType === 0 /* EXACT_INPUT */)
    return getEncodedFuelPathExactInFromTrade(trade, receiver, slippageToleranceBps, deadline);
  else return getEncodedFuelPathExactOutFromTrade(trade, receiver, slippageToleranceBps, deadline);
}
function getFuelPathParamsFromTrade(trade, receiver, slippageToleranceBps) {
  if (trade.tradeType === 0 /* EXACT_INPUT */)
    return getFuelParametersExactInFromTrade(trade, receiver, slippageToleranceBps);
  else return getFuelParametersExactOutFromTrade(trade, receiver, slippageToleranceBps);
}
function getEncodedFuelPathExactInFromTrade(trade, receiver, slippageToleranceBps, deadline) {
  const { path, inputAssets, variableOutputs, inputContracts } = getFuelParametersExactInFromTrade(
    trade,
    receiver,
    slippageToleranceBps
  );
  const abiInterface = new Interface(batch_swap_exact_in_script_loader_abi_default);
  const functionName = "main" /* Main */;
  return {
    params: abiInterface.getFunction(functionName).encodeArguments([path, deadline]),
    inputAssets,
    variableOutputs,
    inputContracts
  };
}
function getEncodedFuelPathExactOutFromTrade(trade, receiver, slippageToleranceBps, deadline) {
  const { path, inputAssets, variableOutputs, inputContracts } = getFuelParametersExactOutFromTrade(
    trade,
    receiver,
    slippageToleranceBps
  );
  const abiInterface = new Interface(batch_swap_exact_out_script_loader_abi_default);
  const functionName = "main" /* Main */;
  return {
    params: abiInterface.getFunction(functionName).encodeArguments([path, deadline]),
    inputAssets,
    variableOutputs,
    inputContracts
  };
}

// src/fuel/converter/index.ts
var FuelPathConverter = class {
  /** Use InterfaceTrade object to encode paths for injecting it as `scriptData` */
  static encodeFuelPaths(trade, receiver, slippageToleranceBps, deadline) {
    return getEncodedFuelPathFromTrade(trade, receiver, slippageToleranceBps, deadline);
  }
  /** Use InterfaceTrade object to get parameters for `main` */
  static getFuelPathParameters(trade, receiver, slippageToleranceBps) {
    return getFuelPathParamsFromTrade(trade, receiver, slippageToleranceBps);
  }
};

export { BPS_BASE, DEAD_LOGGER, DIESEL_AMM_ID, FuelPathConverter, MIRA_AMM_ID, MIRA_HOOKS_ID, ScriptFunctions };
