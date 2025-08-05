"use client";
import { FolderFilled } from "@ant-design/icons";

export default function DashboardMaster() {
  return (
    <div className="p-1">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1">
          LEFT
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            illo at veniam id, earum unde voluptas corporis quas sunt, eligendi
            reiciendis harum eveniet culpa iste nobis consectetur numquam facere
            veritatis! Quaerat repellendus nesciunt laudantium, exercitationem
            labore inventore asperiores qui. Ducimus et hic voluptatibus
            voluptatem a quos explicabo natus maxime blanditiis vero minus
            nobis, magnam laudantium sint sapiente odio eaque, dolor, corrupti
            expedita? Recusandae ratione rerum libero itaque ducimus inventore
            dolores eos, ipsa dignissimos, vel suscipit accusamus eveniet
            necessitatibus assumenda dolor provident debitis accusantium.
            Cupiditate, vero temporibus vel, enim culpa commodi eligendi
            corrupti iste expedita repudiandae modi reprehenderit quos natus sed
            nostrum labore laudantium voluptatibus nisi soluta, explicabo
            dolores qui quis! Maxime iusto dolores assumenda vero minus dolore
            suscipit sint esse necessitatibus molestiae autem, itaque nobis ad
            magnam illo numquam ducimus quam, rem, nemo consequatur tempora.
            Quis harum magni expedita esse minus! Laboriosam, provident.
            Exercitationem aut enim debitis, illo modi provident asperiores
            fugiat deleniti odio harum eius vero ducimus repellendus tenetur
            aliquid inventore accusamus voluptatem libero iste suscipit ab vitae
            rem adipisci. Omnis, tempora architecto ea, reiciendis suscipit unde
            repudiandae ratione natus fugiat quas nihil, mollitia asperiores
            magnam cupiditate eaque vero harum maxime laborum sit quae pariatur!
            Et non temporibus earum.
          </p>
        </div>
        <div className="flex-1 flex justify-around gap-2 flex-wrap">
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
        </div>
      </div>
      <div>DATA</div>
    </div>
  );
}

const CardItem = () => {
  return (
    <div className="w-full sm:w-[250px] p-2 text-center text-gray-300 rounded  bg-gradient-to-br from-blue-500 to-purple-500">
      <div className="flex gap-4 text-xl font-bold justify-center items-center">
        <FolderFilled /> <p>Document</p>
      </div>
      <p className="font-bold text-lg">500</p>
    </div>
  );
};
