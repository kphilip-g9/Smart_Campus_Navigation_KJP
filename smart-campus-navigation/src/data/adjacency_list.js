export const GRAPH = {
  "main_gate": [
    {
      "to": "to_1_agora",
      "weight": 35.8
    },
    {
      "to": "to_nila_ground2",
      "weight": 17.04
    }
  ],
  "to_1_agora": [
    {
      "to": "main_gate",
      "weight": 35.8
    },
    {
      "to": "a_samgatha",
      "weight": 50.5
    },
    {
      "to": "to_2_agora",
      "weight": 21.93
    }
  ],
  "a_samgatha": [
    {
      "to": "to_1_agora",
      "weight": 50.5
    },
    {
      "to": "to_manogatha",
      "weight": 44.7
    },
    {
      "to": "samgatha_block",
      "weight": 18.32
    }
  ],
  "to_2_agora": [
    {
      "to": "to_1_agora",
      "weight": 21.93
    },
    {
      "to": "to_agora_1",
      "weight": 27.89
    },
    {
      "to": "agora",
      "weight": 10.14
    },
    {
      "to": "to_amul",
      "weight": 30.76
    }
  ],
  "to_agora_1": [
    {
      "to": "to_2_agora",
      "weight": 27.89
    },
    {
      "to": "to_amul_2",
      "weight": 44.15
    }
  ],
  "agora": [
    {
      "to": "to_2_agora",
      "weight": 10.14
    }
  ],
  "to_amul": [
    {
      "to": "to_2_agora",
      "weight": 30.76
    },
    {
      "to": "to_1_amul",
      "weight": 20.57
    }
  ],
  "to_1_amul": [
    {
      "to": "to_amul",
      "weight": 20.57
    },
    {
      "to": "amul",
      "weight": 20.75
    }
  ],
  "amul": [
    {
      "to": "to_1_amul",
      "weight": 20.75
    },
    {
      "to": "msp_lab",
      "weight": 224.8
    },
    {
      "to": "to_Innovation_Lab",
      "weight": 40.6
    }
  ],
  "msp_lab": [
    {
      "to": "amul",
      "weight": 224.8
    }
  ],
  "to_Innovation_Lab": [
    {
      "to": "Innovation_Lab",
      "weight": 6.95
    },
    {
      "to": "to_amul_2",
      "weight": 31.74
    },
    {
      "to": "amul",
      "weight": 40.6
    }
  ],
  "Innovation_Lab": [
    {
      "to": "to_Innovation_Lab",
      "weight": 6.95
    }
  ],
  "to_amul_2": [
    {
      "to": "to_Innovation_Lab",
      "weight": 31.74
    },
    {
      "to": "to_agora_1",
      "weight": 44.15
    }
  ],
  "to_manogatha": [
    {
      "to": "a_samgatha",
      "weight": 44.7
    },
    {
      "to": "manogatha",
      "weight": 25.1
    },
    {
      "to": "to_Kaappi",
      "weight": 64.17
    }
  ],
  "manogatha": [
    {
      "to": "to_manogatha",
      "weight": 25.1
    }
  ],
  "samgatha_block": [
    {
      "to": "a_samgatha",
      "weight": 18.32
    }
  ],
  "to_Kaappi": [
    {
      "to": "to_manogatha",
      "weight": 64.17
    },
    {
      "to": "Kaappi",
      "weight": 16.37
    },
    {
      "to": "Minds_eye",
      "weight": 60.33
    }
  ],
  "Kaappi": [
    {
      "to": "to_Kaappi",
      "weight": 16.37
    }
  ],
  "Minds_eye": [
    {
      "to": "to_Kaappi",
      "weight": 60.33
    },
    {
      "to": "to_Bageshri",
      "weight": 22.63
    },
    {
      "to": "to_hostel1",
      "weight": 24.66
    }
  ],
  "to_Bageshri": [
    {
      "to": "Minds_eye",
      "weight": 22.63
    },
    {
      "to": "Bageshri",
      "weight": 50.55
    },
    {
      "to": "to_Hilltop",
      "weight": 71.86
    }
  ],
  "Bageshri": [
    {
      "to": "to_Bageshri",
      "weight": 50.55
    }
  ],
  "to_Hilltop": [
    {
      "to": "to_Bageshri",
      "weight": 71.86
    },
    {
      "to": "Hilltop",
      "weight": 72.63
    }
  ],
  "Hilltop": [
    {
      "to": "to_Hilltop",
      "weight": 72.63
    }
  ],
  "to_hostel1": [
    {
      "to": "Minds_eye",
      "weight": 24.66
    },
    {
      "to": "to_hostel2",
      "weight": 22.76
    }
  ],
  "to_hostel2": [
    {
      "to": "to_hostel1",
      "weight": 22.76
    },
    {
      "to": "tilang_girls",
      "weight": 42.11
    },
    {
      "to": "to_nila_mess",
      "weight": 38.98
    }
  ],
  "tilang_girls": [
    {
      "to": "to_hostel2",
      "weight": 42.11
    }
  ],
  "to_nila_mess": [
    {
      "to": "to_hostel2",
      "weight": 38.98
    },
    {
      "to": "nila_mess",
      "weight": 13.8
    },
    {
      "to": "to_tilang_b",
      "weight": 12.83
    }
  ],
  "nila_mess": [
    {
      "to": "to_nila_mess",
      "weight": 13.8
    }
  ],
  "to_tilang_b": [
    {
      "to": "to_nila_mess",
      "weight": 12.83
    },
    {
      "to": "to_tilang_b_1",
      "weight": 16.68
    },
    {
      "to": "to_brundavan",
      "weight": 94.98
    }
  ],
  "to_tilang_b_1": [
    {
      "to": "to_tilang_b",
      "weight": 16.68
    },
    {
      "to": "tilang_boys",
      "weight": 29.59
    }
  ],
  "tilang_boys": [
    {
      "to": "to_tilang_b_1",
      "weight": 29.59
    }
  ],
  "to_brundavan": [
    {
      "to": "to_tilang_b",
      "weight": 94.98
    },
    {
      "to": "brundavan",
      "weight": 29.36
    }
  ],
  "brundavan": [
    {
      "to": "to_brundavan",
      "weight": 29.36
    }
  ],
  "to_nila_ground2": [
    {
      "to": "main_gate",
      "weight": 17.04
    },
    {
      "to": "to_nila_parking",
      "weight": 13.35
    },
    {
      "to": "to_Sangraha",
      "weight": 78.1
    },
    {
      "to": "to_Sangraha",
      "weight": 78.1
    }
  ],
  "to_nila_parking": [
    {
      "to": "to_nila_ground2",
      "weight": 13.35
    },
    {
      "to": "Nila_parking",
      "weight": 30.6
    },
    {
      "to": "to_nila_ground1",
      "weight": 51.34
    }
  ],
  "Nila_parking": [
    {
      "to": "to_nila_parking",
      "weight": 30.6
    }
  ],
  "to_Sangraha": [
    {
      "to": "to_nila_ground2",
      "weight": 78.1
    },
    {
      "to": "to_nila_ground3",
      "weight": 43.34
    },
    {
      "to": "Sangraha",
      "weight": 52.12
    },
    {
      "to": "to_nila_ground2",
      "weight": 78.1
    }
  ],
  "to_nila_ground3": [
    {
      "to": "to_Sangraha",
      "weight": 43.34
    },
    {
      "to": "Nila_Ground",
      "weight": 63.36
    }
  ],
  "Sangraha": [
    {
      "to": "to_Sangraha",
      "weight": 52.12
    }
  ],
  "Nila_Ground": [
    {
      "to": "to_nila_ground3",
      "weight": 63.36
    },
    {
      "to": "to_c06_building",
      "weight": 69.39
    }
  ],
  "to_c06_building": [
    {
      "to": "Nila_Ground",
      "weight": 69.39
    },
    {
      "to": "to_Sangraha1",
      "weight": 28.16
    },
    {
      "to": "to_c06_building1",
      "weight": 78.05
    }
  ],
  "to_Sangraha1": [
    {
      "to": "to_nila_ground1",
      "weight": 63.27
    },
    {
      "to": "to_c06_building",
      "weight": 28.16
    }
  ],
  "to_nila_ground1": [
    {
      "to": "to_Sangraha1",
      "weight": 63.27
    },
    {
      "to": "to_nila_parking",
      "weight": 51.34
    },
    {
      "to": "Nila_bus_stop",
      "weight": 16.3
    }
  ],
  "Nila_bus_stop": [
    {
      "to": "to_nila_ground1",
      "weight": 16.3
    }
  ],
  "to_c06_building1": [
    {
      "to": "to_c06_building",
      "weight": 78.05
    },
    {
      "to": "to_c06_building2",
      "weight": 41.44
    }
  ],
  "to_c06_building2": [
    {
      "to": "to_c06_building1",
      "weight": 41.44
    },
    {
      "to": "C06_Building,GSCOE_Lab-2",
      "weight": 30.17
    },
    {
      "to": "to_Ewd_office",
      "weight": 142.72
    }
  ],
  "C06_Building,GSCOE_Lab-2": [
    {
      "to": "to_c06_building2",
      "weight": 30.17
    }
  ],
  "to_Ewd_office": [
    {
      "to": "to_c06_building2",
      "weight": 142.72
    },
    {
      "to": "to_Ewd_office1",
      "weight": 24.76
    }
  ],
  "to_Ewd_office1": [
    {
      "to": "to_Ewd_office",
      "weight": 24.76
    },
    {
      "to": "to_Ewd_office2",
      "weight": 41.16
    }
  ],
  "to_Ewd_office2": [
    {
      "to": "to_Ewd_office1",
      "weight": 41.16
    },
    {
      "to": "Ewd_office",
      "weight": 30.92
    },
    {
      "to": "to_cpwd1",
      "weight": 62.33
    }
  ],
  "Ewd_office": [
    {
      "to": "to_Ewd_office2",
      "weight": 30.92
    }
  ],
  "to_cpwd1": [
    {
      "to": "to_Ewd_office2",
      "weight": 62.33
    },
    {
      "to": "to_cpwd",
      "weight": 52.51
    }
  ],
  "to_cpwd": [
    {
      "to": "to_cpwd1",
      "weight": 52.51
    },
    {
      "to": "CPWD_project_zone",
      "weight": 17.46
    },
    {
      "to": "to_apj",
      "weight": 108.46
    }
  ],
  "CPWD_project_zone": [
    {
      "to": "to_cpwd",
      "weight": 17.46
    }
  ],
  "to_apj": [
    {
      "to": "to_cpwd",
      "weight": 108.46
    },
    {
      "to": "to_apj1",
      "weight": 49.42
    }
  ],
  "to_apj1": [
    {
      "to": "to_apj",
      "weight": 49.42
    },
    {
      "to": "to_apj2",
      "weight": 113.59
    }
  ],
  "to_apj2": [
    {
      "to": "to_apj1",
      "weight": 113.59
    },
    {
      "to": "to_apj3",
      "weight": 67.36
    }
  ],
  "to_apj3": [
    {
      "to": "to_apj2",
      "weight": 67.36
    },
    {
      "to": "to_apj4",
      "weight": 52.15
    }
  ],
  "to_apj4": [
    {
      "to": "to_apj3",
      "weight": 52.15
    },
    {
      "to": "to_apj5",
      "weight": 60.04
    }
  ],
  "to_apj5": [
    {
      "to": "to_apj4",
      "weight": 60.04
    },
    {
      "to": "to_apj6",
      "weight": 45.34
    }
  ],
  "to_apj6": [
    {
      "to": "to_apj5",
      "weight": 45.34
    },
    {
      "to": "sw2_apj",
      "weight": 15.35
    }
  ],
  "sw2_apj": [
    {
      "to": "to_apj6",
      "weight": 15.35
    },
    {
      "to": "sw_apj",
      "weight": 19.08
    },
    {
      "to": "f_apj",
      "weight": 42.35
    }
  ],
  "sw_apj": [
    {
      "to": "sw2_apj",
      "weight": 19.08
    },
    {
      "to": "Apj_Parking",
      "weight": 18.33
    },
    {
      "to": "nw_apj",
      "weight": 49.88
    },
    {
      "to": "Apj",
      "weight": 45
    }
  ],
  "f_apj": [
    {
      "to": "sw2_apj",
      "weight": 42.35
    },
    {
      "to": "se2_apj",
      "weight": 47.18
    }
  ],
  "se2_apj": [
    {
      "to": "f_apj",
      "weight": 47.18
    },
    {
      "to": "se_apj",
      "weight": 43.74
    },
    {
      "to": "abc1",
      "weight": 66.66
    }
  ],
  "se_apj": [
    {
      "to": "se2_apj",
      "weight": 43.74
    },
    {
      "to": "ne_apj",
      "weight": 47.86
    },
    {
      "to": "Apj",
      "weight": 37.12
    }
  ],
  "abc1": [
    {
      "to": "se2_apj",
      "weight": 66.66
    },
    {
      "to": "abc2",
      "weight": 147.6
    }
  ],
  "abc2": [
    {
      "to": "abc1",
      "weight": 147.6
    },
    {
      "to": "abc3",
      "weight": 83.16
    }
  ],
  "abc3": [
    {
      "to": "abc2",
      "weight": 83.16
    },
    {
      "to": "abc4",
      "weight": 0
    }
  ],
  "abc4": [
    {
      "to": "abc3",
      "weight": 0
    },
    {
      "to": "abc5",
      "weight": 197.98
    }
  ],
  "abc5": [
    {
      "to": "abc4",
      "weight": 197.98
    },
    {
      "to": "abc6",
      "weight": 201.78
    }
  ],
  "abc6": [
    {
      "to": "abc5",
      "weight": 201.78
    },
    {
      "to": "abc7",
      "weight": 12.37
    },
    {
      "to": "abc11",
      "weight": 21.11
    }
  ],
  "abc7": [
    {
      "to": "abc6",
      "weight": 12.37
    },
    {
      "to": "abc8",
      "weight": 16.16
    }
  ],
  "abc8": [
    {
      "to": "abc7",
      "weight": 16.16
    },
    {
      "to": "abc9",
      "weight": 16.39
    }
  ],
  "abc9": [
    {
      "to": "abc8",
      "weight": 16.39
    },
    {
      "to": "abc12",
      "weight": 10.14
    }
  ],
  "abc12": [
    {
      "to": "abc9",
      "weight": 10.14
    },
    {
      "to": "abc10",
      "weight": 8.09
    },
    {
      "to": "abc11",
      "weight": 14.43
    }
  ],
  "abc10": [
    {
      "to": "abc12",
      "weight": 8.09
    },
    {
      "to": "to_Kedaram_parking",
      "weight": 31.71
    }
  ],
  "abc11": [
    {
      "to": "abc12",
      "weight": 14.43
    },
    {
      "to": "abc6",
      "weight": 21.11
    },
    {
      "to": "to_saveri_bridge1",
      "weight": 13.83
    }
  ],
  "to_Kedaram_parking": [
    {
      "to": "abc10",
      "weight": 31.71
    },
    {
      "to": "Kedaram_parking",
      "weight": 6.81
    },
    {
      "to": "to_cricket_ground2",
      "weight": 68.95
    },
    {
      "to": "kedaram",
      "weight": 27.29
    }
  ],
  "Kedaram_parking": [
    {
      "to": "to_Kedaram_parking",
      "weight": 6.81
    }
  ],
  "to_cricket_ground2": [
    {
      "to": "to_Kedaram_parking",
      "weight": 68.95
    },
    {
      "to": "to_cricket_ground1",
      "weight": 32.46
    },
    {
      "to": "to_cycle_parking1",
      "weight": 60.17
    }
  ],
  "kedaram": [
    {
      "to": "to_Kedaram_parking",
      "weight": 27.29
    },
    {
      "to": "to_cycle_parking2",
      "weight": 36.71
    },
    {
      "to": "to_kedaram",
      "weight": 24.51
    }
  ],
  "to_cricket_ground1": [
    {
      "to": "to_cricket_ground2",
      "weight": 32.46
    },
    {
      "to": "Cricket_ground",
      "weight": 12.69
    }
  ],
  "Cricket_ground": [
    {
      "to": "to_cricket_ground1",
      "weight": 12.69
    }
  ],
  "to_cycle_parking1": [
    {
      "to": "to_cricket_ground2",
      "weight": 60.17
    },
    {
      "to": "to_malhar",
      "weight": 31.91
    },
    {
      "to": "to_cycle_parking2",
      "weight": 53.47
    },
    {
      "to": "to_basketball_court3",
      "weight": 93.45
    }
  ],
  "to_malhar": [
    {
      "to": "to_cycle_parking1",
      "weight": 31.91
    },
    {
      "to": "to_saveri2",
      "weight": 71.7
    },
    {
      "to": "to_saveri",
      "weight": 64.55
    },
    {
      "to": "to_malhar1",
      "weight": 51.9
    }
  ],
  "to_cycle_parking2": [
    {
      "to": "to_cycle_parking1",
      "weight": 53.47
    },
    {
      "to": "kedaram",
      "weight": 36.71
    },
    {
      "to": "to_saveri",
      "weight": 29.43
    }
  ],
  "to_saveri": [
    {
      "to": "to_cycle_parking2",
      "weight": 29.43
    },
    {
      "to": "to_satcad",
      "weight": 24.21
    },
    {
      "to": "to_saveri1",
      "weight": 75.59
    },
    {
      "to": "to_malhar",
      "weight": 64.55
    },
    {
      "to": "to_kedaram",
      "weight": 72.57
    }
  ],
  "to_basketball_court3": [
    {
      "to": "to_cycle_parking1",
      "weight": 93.45
    },
    {
      "to": "to_basketball_court2",
      "weight": 28.44
    }
  ],
  "to_basketball_court2": [
    {
      "to": "to_basketball_court3",
      "weight": 28.44
    },
    {
      "to": "to_basketball_court1",
      "weight": 49.99
    }
  ],
  "to_basketball_court1": [
    {
      "to": "to_basketball_court2",
      "weight": 49.99
    },
    {
      "to": "Basketball_Court",
      "weight": 25.53
    },
    {
      "to": "malhar_Boys_washing_area",
      "weight": 20.91
    }
  ],
  "Basketball_Court": [
    {
      "to": "to_basketball_court1",
      "weight": 25.53
    }
  ],
  "malhar_Boys_washing_area": [
    {
      "to": "to_basketball_court1",
      "weight": 20.91
    },
    {
      "to": "to_malaher_back2",
      "weight": 30.71
    }
  ],
  "to_malaher_back2": [
    {
      "to": "malhar_Boys_washing_area",
      "weight": 30.71
    },
    {
      "to": "to_malaher_back1",
      "weight": 33.29
    }
  ],
  "to_malaher_back1": [
    {
      "to": "to_malaher_back2",
      "weight": 33.29
    },
    {
      "to": "to_malaher_back",
      "weight": 33.83
    }
  ],
  "to_malaher_back": [
    {
      "to": "to_malaher_back1",
      "weight": 33.83
    },
    {
      "to": "malhar",
      "weight": 27.94
    },
    {
      "to": "to_saveri_back2",
      "weight": 27.72
    }
  ],
  "malhar": [
    {
      "to": "to_malaher_back",
      "weight": 27.94
    },
    {
      "to": "to_malhar1",
      "weight": 38.14
    }
  ],
  "to_saveri_back2": [
    {
      "to": "to_malaher_back",
      "weight": 27.72
    },
    {
      "to": "to_saveri_back1",
      "weight": 28.16
    },
    {
      "to": "to_saveri_cycle_parking",
      "weight": 43.27
    }
  ],
  "to_saveri_back1": [
    {
      "to": "to_saveri_back2",
      "weight": 28.16
    },
    {
      "to": "to_saveri2",
      "weight": 36.3
    },
    {
      "to": "to_saveri_cycle_parking",
      "weight": 26.65
    }
  ],
  "to_saveri2": [
    {
      "to": "to_saveri_back1",
      "weight": 36.3
    },
    {
      "to": "to_malhar",
      "weight": 71.7
    },
    {
      "to": "Saveri",
      "weight": 23.85
    }
  ],
  "to_saveri_cycle_parking": [
    {
      "to": "to_saveri_back1",
      "weight": 26.65
    },
    {
      "to": "to_saveri_back2",
      "weight": 43.27
    },
    {
      "to": "saveri_cycle_parking",
      "weight": 57.51
    }
  ],
  "saveri_cycle_parking": [
    {
      "to": "to_saveri_cycle_parking",
      "weight": 57.51
    },
    {
      "to": "to_saveri_cycle_parking1",
      "weight": 41.29
    }
  ],
  "to_saveri_cycle_parking1": [
    {
      "to": "saveri_cycle_parking",
      "weight": 41.29
    },
    {
      "to": "to_saveri1",
      "weight": 40.93
    }
  ],
  "to_saveri1": [
    {
      "to": "to_saveri_cycle_parking1",
      "weight": 40.93
    },
    {
      "to": "to_saveri",
      "weight": 75.59
    },
    {
      "to": "Saveri",
      "weight": 37.45
    }
  ],
  "to_saveri_bridge1": [
    {
      "to": "abc11",
      "weight": 13.83
    },
    {
      "to": "to_saveri_bridge",
      "weight": 55.87
    }
  ],
  "to_saveri_bridge": [
    {
      "to": "to_saveri_bridge1",
      "weight": 55.87
    },
    {
      "to": "to_satcad",
      "weight": 17.93
    }
  ],
  "to_satcad": [
    {
      "to": "to_saveri_bridge",
      "weight": 17.93
    },
    {
      "to": "to_Saraswati1",
      "weight": 143.47
    },
    {
      "to": "Satcad",
      "weight": 23.5
    },
    {
      "to": "to_saveri",
      "weight": 24.21
    }
  ],
  "Saraswati": [
    {
      "to": "to_Saraswati",
      "weight": 42.61
    },
    {
      "to": "to_Saraswati3",
      "weight": 58.53
    }
  ],
  "to_Saraswati": [
    {
      "to": "Saraswati",
      "weight": 42.61
    },
    {
      "to": "to_Saraswati1",
      "weight": 31.37
    },
    {
      "to": "to_Saraswati4",
      "weight": 41.17
    }
  ],
  "to_Saraswati1": [
    {
      "to": "to_Saraswati",
      "weight": 31.37
    },
    {
      "to": "to_Saraswati2",
      "weight": 100.69
    },
    {
      "to": "to_satcad",
      "weight": 143.47
    }
  ],
  "to_Saraswati4": [
    {
      "to": "to_Saraswati",
      "weight": 41.17
    },
    {
      "to": "B24_sculpture",
      "weight": 98.88
    }
  ],
  "to_Saraswati2": [
    {
      "to": "to_Saraswati1",
      "weight": 100.69
    },
    {
      "to": "to_Saraswati3",
      "weight": 40.66
    }
  ],
  "to_Saraswati3": [
    {
      "to": "to_Saraswati2",
      "weight": 40.66
    },
    {
      "to": "Saraswati",
      "weight": 58.53
    },
    {
      "to": "B24_sculpture",
      "weight": 34.28
    }
  ],
  "B24_sculpture": [
    {
      "to": "to_Saraswati3",
      "weight": 34.28
    },
    {
      "to": "to_Saraswati4",
      "weight": 98.88
    }
  ],
  "Satcad": [
    {
      "to": "to_satcad",
      "weight": 23.5
    }
  ],
  "Saveri": [
    {
      "to": "to_saveri1",
      "weight": 37.45
    },
    {
      "to": "to_saveri2",
      "weight": 23.85
    }
  ],
  "to_malhar1": [
    {
      "to": "to_malhar",
      "weight": 51.9
    },
    {
      "to": "malhar",
      "weight": 38.14
    }
  ],
  "to_kedaram": [
    {
      "to": "to_saveri",
      "weight": 72.57
    },
    {
      "to": "kedaram",
      "weight": 24.51
    }
  ],
  "to_nescafe": [
    {
      "to": "Nescafe",
      "weight": 9.82
    },
    {
      "to": "ne_apj",
      "weight": 55.03
    },
    {
      "to": "nw_apj",
      "weight": 18.03
    }
  ],
  "Nescafe": [
    {
      "to": "to_nescafe",
      "weight": 9.82
    }
  ],
  "ne_apj": [
    {
      "to": "to_nescafe",
      "weight": 55.03
    },
    {
      "to": "se_apj",
      "weight": 47.86
    }
  ],
  "nw_apj": [
    {
      "to": "to_nescafe",
      "weight": 18.03
    },
    {
      "to": "sw_apj",
      "weight": 49.88
    },
    {
      "to": "Apj_Parking",
      "weight": 32.48
    }
  ],
  "Apj_Parking": [
    {
      "to": "sw_apj",
      "weight": 18.33
    },
    {
      "to": "nw_apj",
      "weight": 32.48
    }
  ],
  "Apj": [
    {
      "to": "sw_apj",
      "weight": 45
    },
    {
      "to": "se_apj",
      "weight": 37.12
    }
  ],

  "b3": [
    {
      "to": "Saraswati",
      "weight": 342.07
    },
    {
      "to": "b4",
      "weight": 99.4
    }
  ],

  "b4": [
    {
      "to": "Saraswati",
      "weight": 243.4
    },
    {
      "to": "b3",
      "weight": 99.4
    }
  ],

  "Saraswati": [
    {
      "to": "to_Saraswati",
      "weight": 42.61
    },
    {
      "to": "to_Saraswati3",
      "weight": 58.53
    },
    {
      "to": "b3",
      "weight": 342.07
    },
    {
      "to": "b4",
      "weight": 243.4
    }
  ]
};