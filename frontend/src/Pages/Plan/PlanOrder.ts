import { Crown, Sparkle, Zap } from "lucide-react"


export interface planProps {
    key: string,
    name: string,
    price: string,
    description: string,
    period: string,
    credits: string,
    icon: any,
    features: string[],
    button: string,
    current: boolean,
    popular: boolean
}


export const plans: planProps[] = [
    {
        key: 'free',
        name: 'Free',
        price: "₹0",
        period: '/month',
        description: 'For trying out the AI Editor IDE',
        credits: '100 AI credits',
        icon: Zap,
        features: [
            '100 AI Credits',
            'AI code generation',
            'Project Editor',
            'HTML / CSS / JS preview',
            'React preview',
            'Basic project management',
        ],
        button: 'Current Plan',
        current: true,
        popular: false
    },
    {
        key: 'pro',
        name: 'Pro',
        price: "₹299",
        period: '/month',
        description: 'For developer who build regularly',
        credits: '500 AI credits',
        icon: Sparkle,
        features: [
            '500 AI Credits / month',
            'Everything is free',
            'Priority AI generation',
            'Larger Projects',
            'Advance AI coding',
            'Prority Support',
        ],
        button: 'Upgrade to Pro',
        current: false,
        popular: true
    },
    {
        key: 'team',
        name: 'Team',
        price: "₹799",
        period: '/month',
        description: 'For developer who build regularly',
        credits: '2,000 AI credits',
        icon: Crown,
        features: [
            '2,000 AI Credits / month',
            'Everything in Pro',
            'Team collaboration',
            'Shared Projects',
            'Higher AI limits',
            'Prority processing',
            'Team Support'
        ],
        button: 'Upgrade to Team',
        current: false,
        popular: false
    }
]