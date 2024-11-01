export type Promotion = {
	promotionTitle: string;
	promotionDescription: string;
    promotionImage: string;
	promotionType: 'discount' | 'offer'|'upgrade';
	promotionValue: number;
	promotionStartDate: string;
	promotionEndDate: string;
	status: 'active' | 'inactive' | 'expired' | 'scheduled';
    goldenMembersOnly: boolean;
    target: 'all' | 'specific' | 'none';
    specificTarget: string[];
};