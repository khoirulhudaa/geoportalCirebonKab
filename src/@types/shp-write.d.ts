declare module 'shp-write' {
  interface ShpWrite {
      write(data: any, options?: any): any;
  }

  const shpWrite: ShpWrite;
  export default shpWrite;
}
