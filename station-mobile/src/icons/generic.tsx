import React from 'react-native';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

export const ArrowDownIcon = (props: SvgProps) => (
    <Svg width={20} height={20} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.707 12.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 14.586V3a1 1 0 1 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 0Z"
            fill={props.fill || '#F2F2F2'}
        />
    </Svg>
);

export const SettingsIcon = (props: SvgProps) => (
    <Svg width={20} height={20} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9499 11.2833C15.9833 11.0333 15.9999 10.775 15.9999 10.5C15.9999 10.2333 15.9833 9.96667 15.9416 9.71667L17.6333 8.4C17.7833 8.28333 17.8249 8.05833 17.7333 7.89167L16.1333 5.125C16.0333 4.94167 15.8249 4.88333 15.6416 4.94167L13.6499 5.74167C13.2333 5.425 12.7916 5.15833 12.2999 4.95833L11.9999 2.84167C11.9666 2.64167 11.7999 2.5 11.5999 2.5H8.39993C8.19993 2.5 8.0416 2.64167 8.00826 2.84167L7.70826 4.95833C7.2166 5.15833 6.7666 5.43333 6.35826 5.74167L4.3666 4.94167C4.18326 4.875 3.97493 4.94167 3.87493 5.125L2.28326 7.89167C2.18326 8.06667 2.2166 8.28333 2.38326 8.4L4.07493 9.71667C4.03326 9.96667 3.99993 10.2417 3.99993 10.5C3.99993 10.7583 4.0166 11.0333 4.05826 11.2833L2.3666 12.6C2.2166 12.7167 2.17493 12.9417 2.2666 13.1083L3.8666 15.875C3.9666 16.0583 4.17493 16.1167 4.35826 16.0583L6.34993 15.2583C6.7666 15.575 7.20826 15.8417 7.69993 16.0417L7.99993 18.1583C8.0416 18.3583 8.19993 18.5 8.39993 18.5H11.5999C11.7999 18.5 11.9666 18.3583 11.9916 18.1583L12.2916 16.0417C12.7833 15.8417 13.2333 15.575 13.6416 15.2583L15.6333 16.0583C15.8166 16.125 16.0249 16.0583 16.1249 15.875L17.7249 13.1083C17.8249 12.925 17.7833 12.7167 17.6249 12.6L15.9499 11.2833ZM9.99993 13.5C8.34993 13.5 6.99993 12.15 6.99993 10.5C6.99993 8.85 8.34993 7.5 9.99993 7.5C11.6499 7.5 12.9999 8.85 12.9999 10.5C12.9999 12.15 11.6499 13.5 9.99993 13.5Z"
            fill={props.fill || '#F2F2F2'}
        />
    </Svg>
);

export const WalletIcon = (props: SvgProps) => (
    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.8333 7.29167V5.20833C20.8333 4.05937 19.8989 3.125 18.7499 3.125H5.20825C3.48534 3.125 2.08325 4.52708 2.08325 6.25V18.75C2.08325 21.0427 3.952 21.875 5.20825 21.875H20.8333C21.9822 21.875 22.9166 20.9406 22.9166 19.7917V9.375C22.9166 8.22604 21.9822 7.29167 20.8333 7.29167ZM18.7499 16.6667H16.6666V12.5H18.7499V16.6667ZM5.20825 7.29167C4.94004 7.27967 4.6868 7.16468 4.50125 6.97064C4.3157 6.77661 4.21214 6.51848 4.21214 6.25C4.21214 5.98152 4.3157 5.72339 4.50125 5.52936C4.6868 5.33532 4.94004 5.22033 5.20825 5.20833H18.7499V7.29167H5.20825Z"
            fill={props.fill || '#E8E8E8'}
        />
    </Svg>
);

export const MenuIcon = (props: SvgProps) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.875 8.25C12.9062 8.25 13.75 7.40625 13.75 6.375C13.75 5.34375 12.9062 4.5 11.875 4.5C10.8438 4.5 10 5.34375 10 6.375C10 7.40625 10.8438 8.25 11.875 8.25ZM11.875 10.125C10.8438 10.125 10 10.9688 10 12C10 13.0312 10.8438 13.875 11.875 13.875C12.9062 13.875 13.75 13.0312 13.75 12C13.75 10.9688 12.9062 10.125 11.875 10.125ZM10 17.625C10 16.5938 10.8438 15.75 11.875 15.75C12.9062 15.75 13.75 16.5938 13.75 17.625C13.75 18.6562 12.9062 19.5 11.875 19.5C10.8438 19.5 10 18.6562 10 17.625Z"
            fill={props.fill || '#E8E8E8'}
        />
    </Svg>
);

export const SmallRightArrowIcon = (props: SvgProps) => (
    <Svg width={18} height={20} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.56341 14.7071C6.21194 14.3166 6.21194 13.6834 6.56341 13.2929L9.52701 10L6.56341 6.70711C6.21194 6.31658 6.21194 5.68342 6.56341 5.29289C6.91488 4.90237 7.48473 4.90237 7.8362 5.29289L11.4362 9.29289C11.7877 9.68342 11.7877 10.3166 11.4362 10.7071L7.8362 14.7071C7.48473 15.0976 6.91488 15.0976 6.56341 14.7071Z"
            fill={props.fill || '#E8E8E8'}
        />
    </Svg>
);

export const SmallUpArrowIcon = (props: SvgProps) => (
    <Svg width={18} height={20} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.7071 11.4363C14.3166 11.7878 13.6834 11.7878 13.2929 11.4363L10 8.47274L6.70711 11.4363C6.31658 11.7878 5.68342 11.7878 5.29289 11.4363C4.90237 11.0849 4.90237 10.515 5.29289 10.1636L9.29289 6.56356C9.68342 6.21208 10.3166 6.21208 10.7071 6.56356L14.7071 10.1636C15.0976 10.515 15.0976 11.0849 14.7071 11.4363Z"
            fill={props.fill || '#E8E8E8'}
        />
    </Svg>
);

export const WarningIcon = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5ZM7.25 4.25L8.75 4.25L8.75 8.75H7.25L7.25 4.25ZM7.25 10.25H8.75V11.75H7.25V10.25Z"
            fill={props.fill || '#E8E8E8'}
        />
    </Svg>
);

export const PlusIcon = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" {...props}>
        <Path
            d="M6.5 1.5C6.5 0.671573 7.17157 0 8 0C8.82843 0 9.5 0.671573 9.5 1.5V14.5C9.5 15.3284 8.82843 16 8 16C7.17157 16 6.5 15.3284 6.5 14.5V1.5Z"
            fill="white"
        />
        <Path
            d="M14.5 6.5C15.3284 6.5 16 7.17157 16 8C16 8.82843 15.3284 9.5 14.5 9.5L1.5 9.5C0.671573 9.5 -3.62117e-08 8.82843 0 8C3.62117e-08 7.17157 0.671573 6.5 1.5 6.5L14.5 6.5Z"
            fill="white"
        />
    </Svg>
);

export const DoubleCheckIcon = (props: SvgProps) => (
    <Svg width={56} height={56} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.5001 16.3333L39.2101 13.0433L24.4168 27.8367L27.7068 31.1267L42.5001 16.3333ZM52.3935 13.0433L27.7068 37.73L17.9535 28L14.6635 31.29L27.7068 44.3333L55.7068 16.3333L52.3935 13.0433ZM1.45679 31.29L14.5001 44.3333L17.7901 41.0433L4.77012 28L1.45679 31.29Z"
            fill={props.fill || '#1DAA8E'}
        />
    </Svg>
);

export const CopyIcon = (props: SvgProps) => (
    <Svg width={24} height={22} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.0911 1.94543V0.199951L9.45457 0.199951C8.65456 0.199951 8 0.985415 8 1.94543L8 15.9092H9.45457L9.45457 1.94543L21.0911 1.94543ZM24 17.6546L24 5.43631C24 4.4763 23.3454 3.69084 22.5454 3.69084L12.3635 3.69084C11.5635 3.69084 10.9089 4.4763 10.9089 5.43631L10.9089 17.6546C10.9089 18.6146 11.5635 19.4001 12.3635 19.4001H22.5454C23.3454 19.4001 24 18.6146 24 17.6546ZM12.3635 17.6547L12.3635 5.43633L22.5454 5.43633L22.5454 17.6547H12.3635Z"
            fill={props.fill || '#E8E8E8'}
        />
    </Svg>
);

export const MoreVerticalIcon = (props: SvgProps) => (
    <Svg width={24} height={24} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.25 7.5C13.4875 7.5 14.5 6.4875 14.5 5.25C14.5 4.0125 13.4875 3 12.25 3C11.0125 3 10 4.0125 10 5.25C10 6.4875 11.0125 7.5 12.25 7.5ZM12.25 9.75C11.0125 9.75 10 10.7625 10 12C10 13.2375 11.0125 14.25 12.25 14.25C13.4875 14.25 14.5 13.2375 14.5 12C14.5 10.7625 13.4875 9.75 12.25 9.75ZM10 18.75C10 17.5125 11.0125 16.5 12.25 16.5C13.4875 16.5 14.5 17.5125 14.5 18.75C14.5 19.9875 13.4875 21 12.25 21C11.0125 21 10 19.9875 10 18.75Z"
            fill={props.fill || '#F2F2F2'}
        />
    </Svg>
);

export const QRCodeIcon = (props: SvgProps) => (
    <Svg width={20} height={20} fill="none" {...props}>
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.16667 9.66667H2.5V3H9.16667V9.66667ZM7.5 4.66667H4.16667V8H7.5V4.66667Z"
            fill="#F2F2F2"
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.16667 18H2.5V11.3333H9.16667V18ZM7.5 13H4.16667V16.3333H7.5V13Z"
            fill="#F2F2F2"
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.8333 9.66667V3H17.4999V9.66667H10.8333ZM12.4999 8H15.8333V4.66667H12.4999V8Z"
            fill="#F2F2F2"
        />
        <Rect x="15.8333" y="16.3333" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="10.8333" y="11.3333" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="12.5" y="13" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="10.8333" y="14.6667" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="12.5" y="16.3333" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="14.1667" y="14.6667" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="14.1667" y="11.3333" width="1.66667" height="1.66667" fill="#F2F2F2" />
        <Rect x="15.8333" y="13" width="1.66667" height="1.66667" fill="#F2F2F2" />
    </Svg>
);

export const TinyRightArrowIcon = (props: SvgProps) => (
    <Svg width={12} height={12} fill="none" {...props}>
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.37569 3.17574C7.61 2.94142 7.9899 2.94142 8.22422 3.17574L10.6242 5.57574C10.8585 5.81006 10.8585 6.18996 10.6242 6.42427L8.22422 8.82428C7.9899 9.05859 7.61 9.05859 7.37569 8.82428C7.14137 8.58996 7.14137 8.21006 7.37569 7.97575L8.75142 6.60001L1.79995 6.60001C1.46858 6.60001 1.19995 6.33138 1.19995 6.00001C1.19995 5.66864 1.46858 5.40001 1.79995 5.40001L8.75142 5.40001L7.37569 4.02427C7.14137 3.78995 7.14137 3.41005 7.37569 3.17574Z"
            fill="#DFE1EE"
            fill-opacity="0.6"
        />
    </Svg>
);

export const DeleteTrashIcon = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" {...props}>
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.66659 2.5H6.33325L5.66659 3.16667H3.33325V4.5H12.6666V3.16667H10.3333L9.66659 2.5ZM10.6666 6.5V13.1667H5.33325V6.5H10.6666ZM3.99992 5.16667H11.9999V13.1667C11.9999 13.9 11.3999 14.5 10.6666 14.5H5.33325C4.59992 14.5 3.99992 13.9 3.99992 13.1667V5.16667Z"
            fill="#F2F2F2"
        />
    </Svg>
);