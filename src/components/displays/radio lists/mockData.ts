const options = [
  {
    value: 'option0',
    label: 'Option 0',
  },
  {
    value: 'option1',
    label: 'Option 1',
  },
  {
    value: 'option2',
    label: 'Option 2',
  },
  {
    value: 'option3',
    label: 'Option 3',
  },
] as { value: string, label: string }[];

const subOptions = {
  'option0': [
    { name: 'Terra', icon: 'https://station-assets.terra.dev/img/chains/Terra.svg' },
    { name: 'Mars', icon: 'https://station-assets.terra.dev/img/chains/Mars.svg' },
    { name: 'Osmosis', icon: 'https://station-assets.terra.dev/img/chains/Osmosis.svg' }
  ],
  'option1': [
    { name: 'Terra', icon: 'https://station-assets.terra.dev/img/chains/Terra.svg' },
    { name: 'Akash', icon: 'https://station-assets.terra.dev/img/chains/Akash.svg' },
    { name: 'Axelar', icon: 'https://station-assets.terra.dev/img/chains/Axelar.svg' },
    { name: 'Chihuahua', icon: 'https://station-assets.terra.dev/img/chains/Huahua.png' },
    { name: 'Juno', icon: 'https://station-assets.terra.dev/img/chains/Juno.svg' },
    { name: 'Kujira', icon: 'https://station-assets.terra.dev/img/chains/Kujira.png' },
    { name: 'Mars', icon: 'https://station-assets.terra.dev/img/chains/Mars.svg' },
    { name: 'Osmosis', icon: 'https://station-assets.terra.dev/img/chains/Osmosis.svg' }
  ],
  'option2': [
    { name: 'Terra', icon: 'https://station-assets.terra.dev/img/chains/Terra.svg' },
    { name: 'Juno', icon: 'https://station-assets.terra.dev/img/chains/Juno.svg' },
    { name: 'Migaloo', icon: 'https://station-assets.terra.dev/img/chains/Migaloo.svg' },
    { name: 'StaFiHub', icon: 'https://station-assets.terra.dev/img/chains/Migaloo.svg' }
  ],
} as { [key: string]: { name: string, icon: string }[] };

export { options, subOptions };