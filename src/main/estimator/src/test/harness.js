export const DEV_PARTS = [
  {
      _id: 0,
      brand: 'AMD',
      partNumber: '371-3466',
      name: 'Lower Cowl Upper Section - 64-67 Chevelle El Camino',
      price: 129.99,
      labor: 9.99,
      description: 'Lower Cowl',
      image: 'http://www.autometaldirect.com/images/6/371-3466_800.jpg',
      applications: [
          {
              from: 1964,
              to: 1967,
              make: 'CHEVROLET',
              model: 'CHEVELLE'
          }
      ]
  },
  {
      _id: 1,
      brand: 'AMD',
      partNumber: '400-3468',
      name: 'Floor Pan w/ Braces - 68-72 Chevelle GTO Cutlass Skylark',
      price: 599.99,
      labor: 299.99,
      description: 'Complete OE style coverage for replacement of entire floor. This one-piece pan has all the shapes, contours and holes as original. Includes floor pan braces, inner rockers and seat belt provisions already welded in place. Loose brackets for rear seat hold down and wiring are also included. This high quality floor is made on AMD tools. If you are looking for true OE style replacement then this pan will be hard to beat.',
      image: 'http://www.autometaldirect.com/images/6/400-3468_800.jpg',
      applications: [
          {
              from: 1968,
              to: 1972,
              make: 'BUICK',
              model: 'SKYLARK'
          }
      ]
  }
];

export const DEV_SERVICES = [
    {
        _id: 0,
        serviceNumber: 'MB-001',
        name: 'Media blast and epoxy seal',
        price: 0.00,
        labor: 850.00
    },
    {
        _id: 1,
        serviceNumber: 'DR-001-L',
        name: 'Door Re-skin (Left)',
        price: 0.00,
        labor: 275.00
    },
    {
        _id: 2,
        serviceNumber: 'DR-001-R',
        name: 'Door Re-skin (Right)',
        price: 0.00,
        labor: 275.00
    },
    {
        _id: 3,
        serviceNumber: 'HR-001',
        name: 'Door Hinge Rebuild (all)',
        price: 0.00,
        labor: 150.00
    }
];

export const BLANK_PART = {
    _id: undefined,
    brand: undefined,
    partNumber: undefined,
    name: undefined,
    price: undefined,
    labor: undefined,
    description: undefined,
    image: undefined,
    applications: []
};
