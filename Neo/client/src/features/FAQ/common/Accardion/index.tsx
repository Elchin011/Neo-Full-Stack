"use client";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Plus, Minus } from 'lucide-react';
import Box from '@mui/material/Box';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';
import { getAPi } from '@/http/api';

// Custom AccordionSummary with icon on left
const CustomAccordionSummary = (props: {
    expandIcon: React.ReactNode,
    children: React.ReactNode,
    [key: string]: any
}) => {
    const { expandIcon, children, ...other } = props;
    return (
        <AccordionSummary
            {...other}
            sx={{
                flexDirection: 'row',  // icon solda, mətn sağda
                '& .MuiAccordionSummary-expandIconWrapper': {
                    order: 0, // icon ilk sırada
                    marginRight: 1,
                    marginLeft: 0,
                },
                '& .MuiAccordionSummary-content': {
                    order: 1,
                },
            }}
            expandIcon={expandIcon}
        >
            {children}
        </AccordionSummary>
    );
};


export default function ControlledAccordions() {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: QueryKeys.questions.All,
        queryFn: async () => await getAPi("/questions"),
    });

    const questionsData = data?.data || [];

    return (
        <div>
            {questionsData.map((item: { _id: string; question: string; answer: string }) => (
                <Accordion
                    key={item._id}
                    expanded={expanded === item._id}
                    onChange={handleChange(item._id)}
                    sx={{
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        padding: { xs: 1, sm: 2, md: 3 },
                    }}
                    className='py-3'
                >
                    <CustomAccordionSummary
                        expandIcon={expanded === item._id ? <Minus size={16} /> : <Plus size={16} />}
                        aria-controls={`${item._id}-content`}
                    >
                        <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>
                            <span className="font-semibold uppercase tracking-[0.1rem]">
                                {item.question}
                            </span>
                        </Typography>
                    </CustomAccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                            <span className='text-[#868686] pl-2 sm:pl-5.5'>
                                {item.answer}
                            </span>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
