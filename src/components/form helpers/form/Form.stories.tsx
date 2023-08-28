// import { useState } from 'react';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
import type { Meta, StoryObj } from '@storybook/react';

// import Form, { FormArrow, FormGroup, FormItem, FormGroupProps } from './Form';
// import { Input, Select, Checkbox } from 'components/Form Components';
// import { Submit } from 'components/General';

import Form from './Form';
import { InputWrapper } from '../wrappers/InputWrapper/InputWrapper';
import { Input } from 'components/inputs'

// Form
const meta: Meta = {
  title: 'Components/Form/Stories',
  component: Form,
} as Meta;

export default meta;

export const FullFormExample: StoryObj = {
  render: () => (
    <Form onSubmit={() => {}}>
      <InputWrapper label={'Name'}>
        <Input
          // {...register('name', {})}
          placeholder={'mainnet'}
          autoFocus
        />
      </InputWrapper>

      <InputWrapper label={'Chain ID'}>
        <Input
          // {...register('chainID', { required: true })}
          placeholder={'phoenix-1'}
        />
      </InputWrapper>

      <InputWrapper label={'LCD'}>
        <Input
          // {...register('lcd', { required: true })}
          placeholder={'https://phoenix-lcd.terra.dev'}
        />
      </InputWrapper>

      {/* <Checkbox>
        {'Preconfigure accounts'}
      </Checkbox> */}

      {/* <Submit /> */}
    </Form>
  ),
};

// // FormArrow
// export const Arrow: StoryObj = {
//   render: () => (
//     <FormArrow onClick={() => console.log('Arrow clicked')} />
//   ),
// };

// FormGroup
// const FormGroupExample = () => {
//   const [fields, setFields] = useState(['']);

//   const addField = () => {
//     setFields([...fields, '']);
//   };

//   const removeField = (index: number) => {
//     setFields(fields.filter((_, i) => i !== index));
//   };

//   return (
//     <FormItem label='Amount'>
//       {fields.map((_, i) => (
//         <FormGroup
//           button={
//             fields.length - 1 === i
//               ? {
//                   onClick: () => addField(),
//                   children: <AddIcon style={{ fontSize: 18 }} />,
//                 }
//               : {
//                   onClick: () => removeField(i),
//                   children: <RemoveIcon style={{ fontSize: 18 }} />,
//                 }
//           }
//           key={i}
//         >
//           <Input
//             inputMode='decimal'
//             placeholder='0.00'
//             selectBefore={
//               <Select before>
//                 <option value='USD'>USD</option>
//                 <option value='EUR'>EUR</option>
//                 <option value='GBP'>GBP</option>
//               </Select>
//             }
//           />
//         </FormGroup>
//       ))}
//     </FormItem>
//   );
// };
// export const Group: StoryObj = {
//   render: () => (
//     <FormGroupExample />
//   ),
// };

// FormItem
// export const Item: StoryObj = {
//   render: () => (
//     <FormItem
//       label='Username'
//       error='This field is required'
//       extra='Optional'
//     >
//       <Input placeholder='This is an input'/>
//     </FormItem>
//   ),
// };