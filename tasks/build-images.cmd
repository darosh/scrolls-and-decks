convert ./temp/scrolls/input/images-res/g/*.png -resize 84x63 -append ./temp/scrolls/input/images-merged/scrolls_m_g.png
convert ./temp/scrolls/input/images-merged/scrolls_m_g.png -quality 80% ./temp/scrolls/output/images/scrolls_m_g.jpg

convert ./temp/scrolls/input/images-res/g/*.png -resize 64x48 -append ./temp/scrolls/input/images-merged/scrolls_s_g.png
convert ./temp/scrolls/input/images-merged/scrolls_s_g.png -quality 80% ./temp/scrolls/output/images/scrolls_s_g.jpg

convert ./temp/scrolls/input/images-res/g/*.png -resize 192x144 -append ./temp/scrolls/input/images-merged/scrolls_l_g.png
convert ./temp/scrolls/input/images-merged/scrolls_l_g.png -quality 80% ./temp/scrolls/output/images/scrolls_l_g.jpg

convert ./temp/scrolls/input/images-res/e/*.png -resize 84x63 -append ./temp/scrolls/input/images-merged/scrolls_m_e.png
convert ./temp/scrolls/input/images-merged/scrolls_m_e.png -quality 80% ./temp/scrolls/output/images/scrolls_m_e.jpg

convert ./temp/scrolls/input/images-res/e/*.png -resize 64x48 -append ./temp/scrolls/input/images-merged/scrolls_s_e.png
convert ./temp/scrolls/input/images-merged/scrolls_s_e.png -quality 80% ./temp/scrolls/output/images/scrolls_s_e.jpg

convert ./temp/scrolls/input/images-res/e/*.png -resize 192x144 -append ./temp/scrolls/input/images-merged/scrolls_l_e.png
convert ./temp/scrolls/input/images-merged/scrolls_l_e.png -quality 80% ./temp/scrolls/output/images/scrolls_l_e.jpg

convert ./temp/scrolls/input/images-res/o/*.png -resize 84x63 -append ./temp/scrolls/input/images-merged/scrolls_m_o.png
convert ./temp/scrolls/input/images-merged/scrolls_m_o.png -quality 80% ./temp/scrolls/output/images/scrolls_m_o.jpg

convert ./temp/scrolls/input/images-res/o/*.png -resize 64x48 -append ./temp/scrolls/input/images-merged/scrolls_s_o.png
convert ./temp/scrolls/input/images-merged/scrolls_s_o.png -quality 80% ./temp/scrolls/output/images/scrolls_s_o.jpg

convert ./temp/scrolls/input/images-res/o/*.png -resize 192x144 -append ./temp/scrolls/input/images-merged/scrolls_l_o.png
convert ./temp/scrolls/input/images-merged/scrolls_l_o.png -quality 80% ./temp/scrolls/output/images/scrolls_l_o.jpg

convert ./temp/scrolls/input/images-res/d/*.png -resize 84x63 -append ./temp/scrolls/input/images-merged/scrolls_m_d.png
convert ./temp/scrolls/input/images-merged/scrolls_m_d.png -quality 80% ./temp/scrolls/output/images/scrolls_m_d.jpg

convert ./temp/scrolls/input/images-res/d/*.png -resize 64x48 -append ./temp/scrolls/input/images-merged/scrolls_s_d.png
convert ./temp/scrolls/input/images-merged/scrolls_s_d.png -quality 80% ./temp/scrolls/output/images/scrolls_s_d.jpg

convert ./temp/scrolls/input/images-res/d/*.png -resize 192x144 -append ./temp/scrolls/input/images-merged/scrolls_l_d.png
convert ./temp/scrolls/input/images-merged/scrolls_l_d.png -quality 80% ./temp/scrolls/output/images/scrolls_l_d.jpg
