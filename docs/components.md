# Components Used

## Computer System Components

The following computer systems have been tested. Please refer to the section
[Tested Configurations](#tested-configurations) to see if the integrated setup was tested with all your hardware and software.

### Remote Computer System and OS

The Remote Computer System (Remote or Remote Station) should be a low power system intended to run 24/7/365 with solar and/or battery power. However, there is no reason it could not be located near a safe power source, such as an outside plug that is shielded and grounded against water and electrical short. 

The Remote Station should run some version of Linux -- no other operating system has been tested and no instructions for installation of sensor hardware currently exist. The Raspberry Pi foundation has several low cost systems and other manufacturers have built systems with matching wiring/pins. 

Software for these systems is generally free and open source. The available packages, such as Python are also available. 

| System       | OS                  | 
| ------------ | ------------------- |
| RPi Zero 2 W | Ubuntu 24.04 Server |

## Tested Configurations


| System       | OS                  | Temperature | Pressure | Humidity | Solar | Seismic | Location |
| ------------ | ------------------- | ----------- | -------- | -------- | ----- | ------- | -------- |
| RPi Zero 2 W | Ubuntu 24.04 Server | BME 280     | BME 280  | BME 280  | TBD   | TBD     | SIM7600A |
| TBD          | TBD                 | TBD         | TBD      | TBD      | TBD   | TBD     | TBD      |

### Base Station


| System | OS    |
| ------ | ----- |
| RPi 2B | Pi OS |

### Network


| Type       | Router |
| ---------- | ------ |
| WiFi 802.6 | TBD    |
